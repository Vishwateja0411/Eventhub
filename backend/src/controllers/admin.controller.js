const prisma = require('../lib/prisma');

/**
 * GET /api/admin/stats
 * Protected: ADMIN only
 */
const getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalCheckedIn,
      revenueResult,
      rolesBreakdown,
      eventsByStatus,
      categoriesBreakdown,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count({ where: { status: 'CONFIRMED' } }),
      prisma.attendance.count(),
      prisma.registration.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { amount: true },
      }),
      prisma.role.findMany({
        select: {
          name: true,
          _count: { select: { users: true } },
        },
      }),
      prisma.event.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.category.findMany({
        select: {
          name: true,
          slug: true,
          _count: { select: { events: true } },
        },
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, title: true } },
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;
    const turnoutRate =
      totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalCheckedIn,
        totalRevenue,
        turnoutRate: `${turnoutRate}%`,
      },
      rolesBreakdown: rolesBreakdown.map((r) => ({
        role: r.name,
        count: r._count.users,
      })),
      eventsByStatus: eventsByStatus.map((e) => ({
        status: e.status,
        count: e._count.id,
      })),
      categoriesBreakdown: categoriesBreakdown.map((c) => ({
        name: c.name,
        count: c._count.events,
      })),
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 * Protected: ADMIN only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        role: { select: { name: true } },
        _count: {
          select: {
            events: true,
            registrations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        role: u.role.name,
        eventCount: u._count.events,
        registrationCount: u._count.registrations,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/toggle-status
 * Protected: ADMIN only
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    res.json({
      success: true,
      message: `User account has been ${updated.isActive ? 'activated' : 'deactivated'}.`,
      isActive: updated.isActive,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  toggleUserStatus,
};
