const prisma = require('../lib/prisma');

/**
 * GET /api/tickets/:ticketCode
 * Protected: Ticket holder, Event organizer, or Admin
 */
const getTicketByCode = async (req, res, next) => {
  try {
    const { ticketCode } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            category: { select: { name: true } },
          },
        },
        registration: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        attendance: {
          include: {
            scannedBy: { select: { name: true } },
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    // Authorization: User must be ticket holder, event organizer, or Admin
    const isOwner = ticket.registration.userId === req.user.id;
    const isOrganizer = ticket.event.organizerId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ticket.',
      });
    }

    res.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketCode: ticket.ticketCode,
        qrCodeUrl: ticket.qrCodeUrl,
        isValid: ticket.isValid,
        issuedAt: ticket.issuedAt,
        attendee: ticket.registration.user,
        event: {
          id: ticket.event.id,
          title: ticket.event.title,
          slug: ticket.event.slug,
          startDate: ticket.event.startDate,
          endDate: ticket.event.endDate,
          venue: ticket.event.venue,
          city: ticket.event.city,
          bannerUrl: ticket.event.bannerUrl,
          organizer: ticket.event.organizer,
        },
        isCheckedIn: !!ticket.attendance,
        checkInDetails: ticket.attendance
          ? {
              checkedInAt: ticket.attendance.checkedInAt,
              scannedBy: ticket.attendance.scannedBy?.name,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tickets/verify/:ticketCode
 * Protected: Organizer or Admin (scanner preview)
 */
const verifyTicket = async (req, res, next) => {
  try {
    const { ticketCode } = req.params;
    const { eventId } = req.query;

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
        status: 'INVALID',
        message: 'Ticket code does not exist.',
      });
    }

    // Verify organizer permission
    if (ticket.event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        status: 'UNAUTHORIZED',
        message: 'You are not authorized to scan tickets for this event.',
      });
    }

    // Verify event match if eventId provided
    if (eventId && parseInt(eventId, 10) !== ticket.eventId) {
      return res.status(400).json({
        success: false,
        status: 'WRONG_EVENT',
        message: `This ticket is for "${ticket.event.title}", not the selected event.`,
      });
    }

    if (!ticket.isValid) {
      return res.status(400).json({
        success: false,
        status: 'CANCELLED',
        message: 'This ticket has been cancelled or invalidated.',
      });
    }

    if (ticket.attendance) {
      return res.status(409).json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        message: `Ticket already checked in at ${new Date(ticket.attendance.checkedInAt).toLocaleTimeString()}`,
        checkedInAt: ticket.attendance.checkedInAt,
        attendee: ticket.registration.user,
      });
    }

    res.json({
      success: true,
      status: 'READY_FOR_CHECK_IN',
      message: 'Ticket is valid and ready for check-in.',
      attendee: ticket.registration.user,
      event: { id: ticket.event.id, title: ticket.event.title },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTicketByCode,
  verifyTicket,
};
