const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.coerce.number().int().positive('Please select a valid category'),
  venue: z.string().min(2, 'Venue is required'),
  address: z.string().optional().nullable(),
  city: z.string().min(2, 'City is required'),
  country: z.string().default('India'),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date format',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date format',
  }),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1 attendee'),
  price: z.coerce.number().min(0, 'Price cannot be negative').default(0),
  isFree: z.coerce.boolean().optional().default(true),
  currency: z.string().default('INR'),
  bannerUrl: z.string().url().optional().nullable(),
  bannerPublicId: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().optional().default(false),
  isPublished: z.coerce.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        caption: z.string().optional(),
        order: z.number().int().optional().default(0),
      })
    )
    .optional()
    .default([]),
});

const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};
