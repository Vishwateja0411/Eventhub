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
 * POST /api/registrations/:eventId
 * Protected: Authenticated users (USER, ORGANIZER, ADMIN)
 */
const registerForEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const userId = req.user.id;

    // Check if event exists and is open for registration
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    // Atomic transaction: verify capacity + duplicate + create registration & ticket
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check duplicate registration
      const existing = await tx.registration.findUnique({
        where: {
          eventId_userId: { eventId, userId },
        },
      });

      if (existing) {
        if (existing.status === 'CONFIRMED') {
          throw new Error('DUPLICATE_REGISTRATION');
        }
      }

      // 2. Check capacity
      const confirmedCount = await tx.registration.count({
        where: {
          eventId,
          status: 'CONFIRMED',
        },
      });

      if (confirmedCount >= event.capacity) {
        throw new Error('EVENT_SOLD_OUT');
      }

      // 3. Generate unpredictable ticket code & QR code
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

      // 4. Create or re-activate registration
      let registration;
      if (existing && existing.status === 'CANCELLED') {
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
            eventId,
            userId,
            status: 'CONFIRMED',
            amount: event.price,
          },
        });
      }

      // 5. Create ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketCode,
          registrationId: registration.id,
          eventId,
          qrCodeUrl,
          isValid: true,
        },
      });

      // 6. In-app notification
      await tx.notification.create({
        data: {
          userId,
          eventId,
          type: 'REGISTRATION_CONFIRMED',
          title: 'Registration Confirmed! 🎉',
          message: `You are registered for "${event.title}". Your ticket code is ${ticketCode}.`,
        },
      });

      // 7. Activity Log
      await tx.activityLog.create({
        data: {
          userId,
          eventId,
          action: 'EVENT_REGISTRATION',
          details: { ticketCode, amount: event.price },
        },
      });

      return { registration, ticket, event };
    });

    // Send confirmation email asynchronously
    try {
      const template = emailTemplates.ticketConfirmation(
        req.user.name,
        result.event,
        result.ticket.ticketCode,
        result.ticket.qrCodeUrl
      );
      sendEmail({ to: req.user.email, ...template }).catch((err) => {
        console.warn('[EMAIL WARNING] Ticket confirmation email failed:', err.message);
      });
    } catch (_) {}

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your QR ticket is ready.',
      registration: result.registration,
      ticket: {
        id: result.ticket.id,
        ticketCode: result.ticket.ticketCode,
        qrCodeUrl: result.ticket.qrCodeUrl,
        issuedAt: result.ticket.issuedAt,
        isValid: result.ticket.isValid,
      },
    });
  } catch (error) {
    if (error.message === 'DUPLICATE_REGISTRATION') {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }
    if (error.message === 'EVENT_SOLD_OUT') {
      return res.status(400).json({
        success: false,
        message: 'This event is sold out. No spots available.',
      });
    }
    next(error);
  }
};

/**
 * GET /api/registrations/my-registrations
 * Protected: Authenticated user
 */
const getUserRegistrations = async (req, res, next) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          include: {
            category: { select: { name: true, slug: true } },
            organizer: { select: { id: true, name: true } },
          },
        },
        ticket: {
          include: {
            attendance: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      registrations: registrations.map((r) => ({
        id: r.id,
        status: r.status,
        amount: r.amount,
        createdAt: r.createdAt,
        event: r.event,
        ticket: r.ticket
          ? {
              id: r.ticket.id,
              ticketCode: r.ticket.ticketCode,
              qrCodeUrl: r.ticket.qrCodeUrl,
              isValid: r.ticket.isValid,
              isCheckedIn: !!r.ticket.attendance,
              checkedInAt: r.ticket.attendance?.checkedInAt || null,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/registrations/:id
 * Protected: Authenticated user can cancel their registration
 */
const cancelRegistration = async (req, res, next) => {
  try {
    const registrationId = parseInt(req.params.id, 10);
    if (isNaN(registrationId)) {
      return res.status(400).json({ success: false, message: 'Invalid registration ID.' });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        ticket: { include: { attendance: true } },
        event: true,
      },
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    if (registration.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this registration.',
      });
    }

    if (registration.ticket?.attendance) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after attending/checking in.',
      });
    }

    await prisma.$transaction([
      prisma.registration.update({
        where: { id: registrationId },
        data: { status: 'CANCELLED' },
      }),
      prisma.ticket.updateMany({
        where: { registrationId },
        data: { isValid: false },
      }),
    ]);

    res.json({
      success: true,
      message: 'Registration cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/registrations/event/:eventId/attendees
 * Protected: ORGANIZER (event owner) or ADMIN
 */
const getEventAttendees = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    if (isNaN(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendees for this event.',
      });
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId, status: 'CONFIRMED' },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        ticket: {
          include: { attendance: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      attendees: registrations.map((r) => ({
        registrationId: r.id,
        user: r.user,
        ticketCode: r.ticket?.ticketCode,
        isCheckedIn: !!r.ticket?.attendance,
        checkedInAt: r.ticket?.attendance?.checkedInAt || null,
        registeredAt: r.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getUserRegistrations,
  cancelRegistration,
  getEventAttendees,
};
