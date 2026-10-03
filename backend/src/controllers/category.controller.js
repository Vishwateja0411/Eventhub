const prisma = require('../lib/prisma');
const { createCategorySchema } = require('../validators/category.validators');

/**
 * GET /api/categories
 * Public: List all categories with published event count
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            events: {
              where: {
                status: 'PUBLISHED',
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        eventCount: cat._count.events,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:slug
 * Public: Get single category with published events
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        events: {
          where: {
            status: 'PUBLISHED',
            isPublished: true,
          },
          include: {
            organizer: {
              select: { id: true, name: true, avatar: true },
            },
            _count: {
              select: { registrations: true },
            },
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 * Protected: Admin only
 */
const createCategory = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name or slug already exists.',
      });
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        icon: validatedData.icon,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
};
