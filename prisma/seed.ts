import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Textbooks', slug: 'textbooks', description: 'Course books and study materials', icon: '📚' },
  { name: 'Electronics', slug: 'electronics', description: 'Laptops, phones, and gadgets', icon: '💻' },
  { name: 'Furniture', slug: 'furniture', description: 'Desks, chairs, and room furnishings', icon: '🪑' },
  { name: 'Clothing', slug: 'clothing', description: 'Apparel and accessories', icon: '👕' },
  { name: 'Sports & Outdoors', slug: 'sports', description: 'Sports equipment and outdoor gear', icon: '⚽' },
  { name: 'Services', slug: 'services', description: 'Tutoring, moving help, and more', icon: '🤝' },
  { name: 'Tickets', slug: 'tickets', description: 'Event tickets and vouchers', icon: '🎫' },
  { name: 'Miscellaneous', slug: 'misc', description: 'Everything else', icon: '📦' },
];

async function main() {
  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Seeded categories successfully!');
  console.log('You can now run `npm run db:studio` to view the data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
