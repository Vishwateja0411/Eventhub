/**
 * Prisma seed script — creates default roles and sample data
 * Run: npm run db:seed
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── ROLES ──────────────────────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'VISITOR' }, update: {}, create: { name: 'VISITOR' } }),
    prisma.role.upsert({ where: { name: 'USER' },    update: {}, create: { name: 'USER' } }),
    prisma.role.upsert({ where: { name: 'ORGANIZER' }, update: {}, create: { name: 'ORGANIZER' } }),
    prisma.role.upsert({ where: { name: 'ADMIN' },   update: {}, create: { name: 'ADMIN' } }),
  ]);
  console.log('✅ Roles seeded:', roles.map(r => r.name).join(', '));

  const adminRole = roles.find(r => r.name === 'ADMIN');
  const organizerRole = roles.find(r => r.name === 'ORGANIZER');
  const userRole = roles.find(r => r.name === 'USER');

  // ─── ADMIN USER ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventhub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@eventhub.com',
      passwordHash: adminHash,
      roleId: adminRole.id,
      isEmailVerified: true,
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ─── ORGANIZER USER ───────────────────────────────────────────────────────
  const orgHash = await bcrypt.hash('Organizer@123', 12);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eventhub.com' },
    update: {},
    create: {
      name: 'Test Organizer',
      email: 'organizer@eventhub.com',
      passwordHash: orgHash,
      roleId: organizerRole.id,
      isEmailVerified: true,
    },
  });
  console.log('✅ Organizer user:', organizer.email);

  // ─── REGULAR USER ─────────────────────────────────────────────────────────
  const userHash = await bcrypt.hash('User@123', 12);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@eventhub.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@eventhub.com',
      passwordHash: userHash,
      roleId: userRole.id,
      isEmailVerified: true,
    },
  });
  console.log('✅ Regular user:', regularUser.email);

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Technology', slug: 'technology', icon: '💻', description: 'Tech conferences and workshops' },
    { name: 'Music', slug: 'music', icon: '🎵', description: 'Concerts and music events' },
    { name: 'Business', slug: 'business', icon: '💼', description: 'Business and networking events' },
    { name: 'Sports', slug: 'sports', icon: '⚽', description: 'Sports events and competitions' },
    { name: 'Arts', slug: 'arts', icon: '🎨', description: 'Art exhibitions and creative events' },
    { name: 'Food', slug: 'food', icon: '🍕', description: 'Food festivals and culinary events' },
    { name: 'Health', slug: 'health', icon: '🏃', description: 'Health and wellness events' },
    { name: 'Education', slug: 'education', icon: '📚', description: 'Workshops and learning events' },
  ];

  const categories = await Promise.all(
    categoryData.map(cat =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );
  console.log('✅ Categories seeded:', categories.length);

  // ─── SAMPLE EVENTS ────────────────────────────────────────────────────────
  const techCat = categories.find(c => c.slug === 'technology');
  const musicCat = categories.find(c => c.slug === 'music');

  const sampleEvents = [
    {
      title: 'React India 2026',
      slug: 'react-india-2026',
      description: 'The largest React conference in India. Join 500+ developers for talks, workshops, and networking.',
      organizerId: organizer.id,
      categoryId: techCat.id,
      venue: 'Bangalore International Convention Centre',
      city: 'Bangalore',
      address: 'Tumkur Road, Bangalore',
      startDate: new Date('2026-11-15T09:00:00Z'),
      endDate: new Date('2026-11-15T18:00:00Z'),
      capacity: 500,
      price: 999,
      isFree: false,
      status: 'PUBLISHED',
      isFeatured: true,
      isPublished: true,
      tags: ['react', 'javascript', 'frontend'],
    },
    {
      title: 'Mumbai Music Fest 2026',
      slug: 'mumbai-music-fest-2026',
      description: 'A night of live music featuring indie artists from across India.',
      organizerId: organizer.id,
      categoryId: musicCat.id,
      venue: 'NCPA Mumbai',
      city: 'Mumbai',
      address: 'Nariman Point, Mumbai',
      startDate: new Date('2026-12-01T18:00:00Z'),
      endDate: new Date('2026-12-01T23:00:00Z'),
      capacity: 300,
      price: 0,
      isFree: true,
      status: 'PUBLISHED',
      isFeatured: true,
      isPublished: true,
      tags: ['music', 'indie', 'live'],
    },
  ];

  for (const eventData of sampleEvents) {
    await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    });
  }
  console.log('✅ Sample events seeded:', sampleEvents.length);

  console.log('\n🎉 Seed complete!');
  console.log('\nTest credentials:');
  console.log('  Admin:     admin@eventhub.com     / Admin@123');
  console.log('  Organizer: organizer@eventhub.com / Organizer@123');
  console.log('  User:      user@eventhub.com      / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
