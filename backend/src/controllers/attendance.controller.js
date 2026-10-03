const prisma = require('../lib/prisma');
const { checkInSchema } = require('../validators/registration.validators');

/**
 * POST /api/attendance/check-in
 * Protected: ORGANIZER or ADMIN
 */
const checkIn = async (req, res, next) => {
  try {
    const { ticketCode, eventId } = checkInSchema.parse(req.body);

    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode },
      include: {
        event: true,
        registration: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        attendance: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket code. Ticket does not exist.',
      });
    }

    // Role check: Only event organizer or ADMIN can check in attendees
    if (ticket.event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to check in attendees for this event.',
      });
    }

    // Event match validation
    if (eventId && parseInt(eventId, 10) !== ticket.eventId) {
      return res.status(400).json({
        success: false,
        message: `This ticket belongs to event "${ticket.event.title}", not the selected event.`,
      });
    }

    // Ticket validity check
    if (!ticket.isValid) {
      return res.status(400).json({
        success: false,
        message: 'This ticket has been cancelled or invalidated.',
      });
    }

    // Duplicate check-in prevention
    if (ticket.attendance) {
      return res.status(409).json({
        success: false,
        message: `Duplicate Check-in Alert: Ticket was already checked in on ${new Date(
          ticket.attendance.checkedInAt
        ).toLocaleString()}`,
        checkedInAt: ticket.attendance.checkedInAt,
        attendee: ticket.registration.user,
      });
    }

    // Atomic check-in creation
    const attendance = await prisma.attendance.create({
      data: {
        ticketId: ticket.id,
        eventId: ticket.eventId,
        scannedById: req.user.id,
      },
    });

    // Notify attendee of check-in
    try {
      await prisma.notification.create({
        data: {
          userId: ticket.registration.userId,
          eventId: ticket.eventId,
          type: 'CHECK_IN_SUCCESS',
          title: 'Checked In! ✅',
          message: `Welcome to "${ticket.event.title}"! Your ticket was checked in successfully.`,
        },
      });

      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          eventId: ticket.eventId,
          action: 'TICKET_SCANNED',
          details: { ticketCode, attendeeId: ticket.registration.userId },
        },
      });
    } catch (_) {}

    res.json({
      success: true,
      message: `Check-in confirmed for ${ticket.registration.user.name}! Welcome to the event.`,
      attendee: ticket.registration.user,
      event: { id: ticket.event.id, title: ticket.event.title },
      checkedInAt: attendance.checkedInAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/event/:eventId
 * Protected: ORGANIZER or ADMIN
 */
const getEventAttendance = async (req, res, next) => {
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
        message: 'You are not authorized to view attendance for this event.',
      });
    }

    const [totalRegistrations, attendanceRecords] = await Promise.all([
      prisma.registration.count({
        where: { eventId, status: 'CONFIRMED' },
      }),
      prisma.attendance.findMany({
        where: { eventId },
        include: {
          ticket: {
            include: {
              registration: {
                include: {
                  user: { select: { id: true, name: true, email: true, avatar: true } },
                },
              },
            },
          },
          scannedBy: { select: { id: true, name: true } },
        },
        orderBy: { checkedInAt: 'desc' },
      }),
    ]);

    const checkedInCount = attendanceRecords.length;
    const turnoutRate =
      totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

    res.json({
      success: true,
      summary: {
        totalRegistrations,
        checkedInCount,
        turnoutRate: `${turnoutRate}%`,
      },
      records: attendanceRecords.map((att) => ({
        id: att.id,
        ticketCode: att.ticket.ticketCode,
        attendee: att.ticket.registration.user,
        checkedInAt: att.checkedInAt,
        scannedBy: att.scannedBy.name,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  getEventAttendance,
};
