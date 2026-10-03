const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { createEventSchema, updateEventSchema } = require('../validators/event.validators');

/**
 * Generate a clean, URL-safe unique slug
 */
const generateSlug = (title) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 50);
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
};

/**
 * GET /api/events
 * Public: List events with filters, search, sorting & pagination
 */
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      city,
      isFree,
      startDate,
      endDate,
      status,
      sortBy = 'date',
      page = 1,
      limit = 9,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    // Filter builder
    const where = {};

    // For public browsing, show only published events unless specific status requested by auth
    if (status) {
      where.status = status;
    } else {
      where.status = 'PUBLISHED';
      where.isPublished = true;
    }

    // Keyword search in title, description, or venue
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { venue: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Filter by city
    if (city && city.trim()) {
      where.city = { equals: city.trim(), mode: 'insensitive' };
    }

    // Filter by category slug or ID
    if (category) {
      if (!isNaN(parseInt(category, 10))) {
        where.categoryId = parseInt(category, 10);
      } else {
        where.category = { slug: category };
      }
    }

    // Filter by free / paid
    if (isFree !== undefined && isFree !== '') {
      where.isFree = isFree === 'true' || isFree === true;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    // Sorting options
    let orderBy = { startDate: 'asc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };

    const [total, rawEvents] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          organizer: {
            select: { id: true, name: true, avatar: true, email: true },
          },
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
          images: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              registrations: {
                where: { status: 'CONFIRMED' },
              },
            },
          },
        },
      }),
    ]);

    // Format events with available spots
    const events = rawEvents.map((evt) => {
      const confirmedCount = evt._count?.registrations || 0;
      const spotsLeft = Math.max(0, evt.capacity - confirmedCount);
      return {
        ...evt,
        attendeeCount: confirmedCount,
        spotsLeft,
        isSoldOut: spotsLeft <= 0,
      };
    });

    res.json({
      success: true,
      events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/events/featured
 * Public: Get top featured upcoming events
 */
const getFeaturedEvents = async (req, res, next) => {
  try {
    const rawEvents = await prisma.event.findMany({
      where: {
        isFeatured: true,
        status: 'PUBLISHED',
        isPublished: true,
        startDate: { gte: new Date() },
      },
      take: 6,
      orderBy: { startDate: 'asc' },
      include: {
        organizer: {
          select: { id: true, name: true, avatar: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            registrations: { where: { status: 'CONFIRMED' } },
          },
        },
      },
    });

    const events = rawEvents.map((evt) => ({
      ...evt,
      attendeeCount: evt._count?.registrations || 0,
      spotsLeft: Math.max(0, evt.capacity - (evt._count?.registrations || 0)),
    }));

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/events/:slugOrId
 * Public: Get event details by slug or numeric ID
 */
const getEventBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = !isNaN(parseInt(slugOrId, 10));

    const event = await prisma.event.findFirst({
      where: isNumeric
        ? { OR: [{ id: parseInt(slugOrId, 10) }, { slug: slugOrId }] }
        : { slug: slugOrId },
      include: {
        organizer: {
          select: { id: true, name: true, avatar: true, bio: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true, description: true },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            registrations: { where: { status: 'CONFIRMED' } },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    const confirmedCount = event._count?.registrations || 0;
    const spotsLeft = Math.max(0, event.capacity - confirmedCount);

    res.json({
      success: true,
      event: {
        ...event,
        attendeeCount: confirmedCount,
        spotsLeft,
        isSoldOut: spotsLeft <= 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/events
 * Protected: ORGANIZER or ADMIN
 */
const createEvent = async (req, res, next) => {
  try {
    const validatedData = createEventSchema.parse(req.body);

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected.',
      });
    }

    const slug = generateSlug(validatedData.title);
    const isFree = validatedData.price === 0 || validatedData.isFree === true;

    // Create event with optional gallery images
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        organizerId: req.user.id,
        categoryId: validatedData.categoryId,
        venue: validatedData.venue,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        capacity: validatedData.capacity,
        price: validatedData.price,
        isFree,
        currency: validatedData.currency,
        bannerUrl: validatedData.bannerUrl,
        bannerPublicId: validatedData.bannerPublicId,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        status: validatedData.isPublished ? 'PUBLISHED' : 'DRAFT',
        tags: validatedData.tags || [],
        images: validatedData.images?.length
          ? {
              create: validatedData.images.map((img, idx) => ({
                url: img.url,
                publicId: img.publicId,
                caption: img.caption,
                order: img.order ?? idx,
              })),
            }
          : undefined,
      },
      include: {
        organizer: {
          select: { id: true, name: true, avatar: true },
        },
        category: true,
        images: true,
      },
    });

    // Log activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: req.user.id,
          eventId: event.id,
          action: 'EVENT_CREATED',
          details: { title: event.title, slug: event.slug },
        },
      });
    } catch (_) {}

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/events/:id
 * Protected: ORGANIZER (owner) or ADMIN
 */
const updateEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Role check: Only event organizer or ADMIN can update
    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event.',
      });
    }

    const validatedData = updateEventSchema.parse(req.body);

    const updatePayload = {};
    if (validatedData.title !== undefined) updatePayload.title = validatedData.title;
    if (validatedData.description !== undefined) updatePayload.description = validatedData.description;
    if (validatedData.categoryId !== undefined) updatePayload.categoryId = validatedData.categoryId;
    if (validatedData.venue !== undefined) updatePayload.venue = validatedData.venue;
    if (validatedData.address !== undefined) updatePayload.address = validatedData.address;
    if (validatedData.city !== undefined) updatePayload.city = validatedData.city;
    if (validatedData.country !== undefined) updatePayload.country = validatedData.country;
    if (validatedData.latitude !== undefined) updatePayload.latitude = validatedData.latitude;
    if (validatedData.longitude !== undefined) updatePayload.longitude = validatedData.longitude;
    if (validatedData.startDate !== undefined) updatePayload.startDate = new Date(validatedData.startDate);
    if (validatedData.endDate !== undefined) updatePayload.endDate = new Date(validatedData.endDate);
    if (validatedData.capacity !== undefined) updatePayload.capacity = validatedData.capacity;
    if (validatedData.price !== undefined) {
      updatePayload.price = validatedData.price;
      updatePayload.isFree = validatedData.price === 0;
    }
    if (validatedData.isFree !== undefined) updatePayload.isFree = validatedData.isFree;
    if (validatedData.bannerUrl !== undefined) updatePayload.bannerUrl = validatedData.bannerUrl;
    if (validatedData.bannerPublicId !== undefined) updatePayload.bannerPublicId = validatedData.bannerPublicId;
    if (validatedData.isFeatured !== undefined) updatePayload.isFeatured = validatedData.isFeatured;
    if (validatedData.isPublished !== undefined) {
      updatePayload.isPublished = validatedData.isPublished;
      if (validatedData.isPublished && event.status === 'DRAFT') {
        updatePayload.status = 'PUBLISHED';
      }
    }
    if (validatedData.status !== undefined) updatePayload.status = validatedData.status;
    if (validatedData.tags !== undefined) updatePayload.tags = validatedData.tags;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updatePayload,
      include: {
        organizer: {
          select: { id: true, name: true, avatar: true },
        },
        category: true,
        images: true,
      },
    });

    res.json({
      success: true,
      message: 'Event updated successfully.',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/events/:id
 * Protected: ORGANIZER (owner) or ADMIN
 */
const deleteEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid event ID.' });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    // If there are existing registrations, cancel the event instead of hard-deleting to preserve history
    if (event._count.registrations > 0) {
      const cancelledEvent = await prisma.event.update({
        where: { id },
        data: { status: 'CANCELLED', isPublished: false },
      });

      return res.json({
        success: true,
        message: 'Event has active registrations — status has been set to CANCELLED instead of deleted.',
        event: cancelledEvent,
      });
    }

    // Clean delete if no registrations exist
    await prisma.event.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/events/organizer/my-events
 * Protected: ORGANIZER or ADMIN
 */
const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: { organizerId: req.user.id },
      include: {
        category: { select: { name: true } },
        _count: {
          select: {
            registrations: true,
            attendance: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = events.map((e) => ({
      ...e,
      attendeeCount: e._count.registrations,
      checkInCount: e._count.attendance,
      spotsLeft: Math.max(0, e.capacity - e._count.registrations),
    }));

    res.json({
      success: true,
      events: formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getFeaturedEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
};
