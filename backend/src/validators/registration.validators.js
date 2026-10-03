const { z } = require('zod');

const registerEventSchema = z.object({
  eventId: z.coerce.number().int().positive('Valid eventId is required'),
});

const checkInSchema = z.object({
  ticketCode: z.string().min(1, 'Ticket code is required'),
  eventId: z.coerce.number().int().positive().optional(),
});

module.exports = {
  registerEventSchema,
  checkInSchema,
};
