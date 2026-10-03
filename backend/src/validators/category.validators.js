const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  slug: z.string().min(2).max(60).optional(),
  description: z.string().max(250).optional(),
  icon: z.string().optional(),
});

module.exports = {
  createCategorySchema,
};
