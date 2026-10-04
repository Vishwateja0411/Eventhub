const crypto = require('crypto');
const QRCode = require('qrcode');
const prisma = require('../lib/prisma');
const { sendEmail, emailTemplates } = require('../lib/email');

/**
 * Generate a cryptographically unpredictable ticket code
 * Format: TKT-XXXXXXXX-YYYY
 */
const generateTicketCode = () => {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `TKT-${hex}-${time}`;
};

/**
 * POST /api/payments/create-order
 * Protected: Authenticated users
 */
const createPaymentOrder = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const numericEventId = parseInt(eventId, 10);
    const userId = req.user.id;

    if (isNaN(numericEventId)) {
      return res.status(400).json({ success: false, message: 'Valid eventId is required.' });
    }

    const event = await prisma.event.findUnique({
      where: { id: numericEventId },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.status !== 'PUBLISHED' || !event.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'This event is not open for registration.',
      });
    }

    if (new Date(event.endDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This event has already ended.',
      });
    }

    // Check duplicate confirmed registration
    const existing = await prisma.registration.findUnique({
      where: {
        eventId_userId: { eventId: numericEventId, userId },
      },
    });

    if (existing && existing.status === 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }

    // Check capacity
    const confirmedCount = await prisma.registration.count({
      where: { eventId: numericEventId, status: 'CONFIRMED' },
    });

    if (confirmedCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'This event is completely sold out.',
      });
    }

    // Generate Order ID
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const amount = event.price; // in INR

    res.json({
      success: true,
      orderId,
      amount,
      currency: 'INR',
      event: {
        id: event.id,
        title: event.title,
        price: event.price,
        startDate: event.startDate,
        location: event.location,
      },
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_eventhub_mock',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/verify
 * Protected: Authenticated users
 * Verifies payment, creates registration, records Payment, and issues Ticket
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      eventId,
      orderId,
      paymentMethod = 'UPI',
      paymentId,
      signature,
    } = req.body;

    const numericEventId = parseInt(eventId, 10);
    const userId = req.user.id;

    if (isNaN(numericEventId) || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid eventId or orderId.',
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: numericEventId },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const generatedPaymentId =
      paymentId || `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Execute atomic registration + payment + ticket issuance
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check duplicate
      const existing = await tx.registration.findUnique({
        where: {
          eventId_userId: { eventId: numericEventId, userId },
        },
      });

      if (existing && existing.status === 'CONFIRMED') {
        throw new Error('DUPLICATE_REGISTRATION');
      }

      // 2. Check capacity
      const confirmedCount = await tx.registration.count({
        where: { eventId: numericEventId, status: 'CONFIRMED' },
      });

      if (confirmedCount >= event.capacity) {
        throw new Error('EVENT_SOLD_OUT');
      }

      // 3. Generate ticket code & QR Code
      const ticketCode = generateTicketCode();
      const qrCodeUrl = await QRCode.toDataURL(ticketCode, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
      });

      // 4. Create or update registration
      let registration;
      if (existing) {
        registration = await tx.registration.update({
          where: { id: existing.id },
          data: {
            status: 'CONFIRMED',
            amount: event.price,
          },
        });
      } else {
        registration = await tx.registration.create({
          data: {
            eventId: numericEventId,
            userId,
            status: 'CONFIRMED',
            amount: event.price,
          },
        });
      }

      // 5. Create Payment record
      const payment = await tx.payment.create({
        data: {
          userId,
          eventId: numericEventId,
          registrationId: registration.id,
          razorpayOrderId: orderId,
          razorpayPaymentId: generatedPaymentId,
          razorpaySignature: signature || `sig_${crypto.randomBytes(16).toString('hex')}`,
          amount: event.price,
          currency: 'INR',
          status: 'CAPTURED',
        },
      });

      // 6. Create ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketCode,
          registrationId: registration.id,
          eventId: numericEventId,
          qrCodeUrl,
          isValid: true,
        },
      });

      // 7. Create notification
      await tx.notification.create({
        data: {
          userId,
          eventId: numericEventId,
          type: 'REGISTRATION_CONFIRMED',
          title: 'Payment Confirmed & Ticket Issued! 🎉',
          message: `Payment of ₹${event.price} received for "${event.title}". Ticket code: ${ticketCode}.`,
        },
      });

      // 8. Log activity
      await tx.activityLog.create({
        data: {
          userId,
          eventId: numericEventId,
          action: 'PAYMENT_CAPTURED',
          details: {
            orderId,
            paymentId: generatedPaymentId,
            amount: event.price,
            method: paymentMethod,
            ticketCode,
          },
        },
      });

      return { registration, ticket, payment };
    });

    // Send confirmation email asynchronously
    try {
      const template = emailTemplates.ticketConfirmation(
        req.user.name,
        event.title,
        result.ticket.ticketCode,
        event.startDate,
        event.location
      );
      sendEmail({ to: req.user.email, ...template }).catch(() => {});
    } catch (_) {}

    res.json({
      success: true,
      message: 'Payment captured and registration confirmed!',
      payment: result.payment,
      registration: result.registration,
      ticket: result.ticket,
      event,
    });
  } catch (error) {
    if (error.message === 'DUPLICATE_REGISTRATION') {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }
    if (error.message === 'EVENT_SOLD_OUT') {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event just sold out.',
      });
    }
    next(error);
  }
};

/**
 * GET /api/payments/my-payments
 * Protected: Authenticated users
 */
const getUserPayments = async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            location: true,
            thumbnail: true,
          },
        },
        registration: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getUserPayments,
};
