import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Agri Market...');

  // Hidden test account
  const testHash = await bcrypt.hash('nq8PvYs#Yz', 12);
  await prisma.user.upsert({
    where: { email: 'abacus-b1dcb069@example.com' },
    update: {},
    create: {
      email: 'abacus-b1dcb069@example.com',
      passwordHash: testHash,
      name: 'Admin Test',
      role: 'vendedor',
      phone: '50370000000',
    },
  });
  const testUser = await prisma.user.findUnique({ where: { email: 'abacus-b1dcb069@example.com' } });
  if (testUser) {
    await prisma.vendorProfile.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        businessName: 'Finca Test',
        description: 'Finca de prueba',
        specialty: 'Mercado General',
        location: 'San Salvador',
      },
    });
  }

  // Vendor 1: Finca El Paraíso
  const v1Hash = await bcrypt.hash('vendor123', 12);
  const v1 = await prisma.user.upsert({
    where: { email: 'finca.paraiso@agrimarket.sv' },
    update: {},
    create: {
      email: 'finca.paraiso@agrimarket.sv',
      passwordHash: v1Hash,
      name: 'Carlos Martínez',
      role: 'vendedor',
      phone: '50371234567',
    },
  });
  await prisma.vendorProfile.upsert({
    where: { userId: v1.id },
    update: {},
    create: {
      userId: v1.id,
      businessName: 'Finca El Paraíso',
      description: 'Producimos las mejores verduras y hortalizas de la zona de Santa Ana. Cultivo orgánico con más de 15 años de experiencia.',
      specialty: 'Verduras y Hortalizas',
      location: 'Santa Ana, El Salvador',
      coverImage: 'https://images.unsplash.com/photo-1612305424474-403a79cc4383?ixlib=rb-4.0.3&q=80&w=1280',
      avatar: 'https://cdn.abacus.ai/images/5f865553-4814-4a6b-8034-0bcc4337d733.png',
      isFeatured: true,
      rating: 4.8,
    },
  });

  // Products for vendor 1
  await prisma.product.upsert({
    where: { id: 'prod-tomate-01' },
    update: {},
    create: {
      id: 'prod-tomate-01',
      vendorId: v1.id,
      name: 'Tomate Criollo',
      description: 'Tomates frescos de cosecha diaria, cultivados sin químicos.',
      price: 0.75,
      quantity: 200,
      category: 'verduras',
      imageUrl: 'https://images.pexels.com/photos/30964383/pexels-photo-30964383/free-photo-of-dark-aesthetic-fresh-tomatoes-on-wooden-board.jpeg',
      unit: 'lb',
    },
  });
  await prisma.product.upsert({
    where: { id: 'prod-lechuga-01' },
    update: {},
    create: {
      id: 'prod-lechuga-01',
      vendorId: v1.id,
      name: 'Lechuga Fresca',
      description: 'Lechuga verde recién cortada, crujiente y perfecta para ensaladas.',
      price: 0.50,
      quantity: 150,
      category: 'verduras',
      imageUrl: 'https://sjclimate.news/wp-content/uploads/2024/11/Organic-Farmer-1200x900.jpg',
      unit: 'unidad',
    },
  });

  // Vendor 2: Frutas Tropicales Don Pedro
  const v2Hash = await bcrypt.hash('vendor123', 12);
  const v2 = await prisma.user.upsert({
    where: { email: 'frutadonpedro@agrimarket.sv' },
    update: {},
    create: {
      email: 'frutadonpedro@agrimarket.sv',
      passwordHash: v2Hash,
      name: 'Pedro Ramírez',
      role: 'vendedor',
      phone: '50372345678',
    },
  });
  await prisma.vendorProfile.upsert({
    where: { userId: v2.id },
    update: {},
    create: {
      userId: v2.id,
      businessName: 'Frutas Tropicales Don Pedro',
      description: 'Las frutas más frescas y dulces del oriente salvadoreño. Especialistas en frutas tropicales.',
      specialty: 'Frutas Frescas',
      location: 'San Miguel, El Salvador',
      coverImage: 'https://live.staticflickr.com/7028/6672475421_46956486c1_b.jpg',
      avatar: 'https://images.pexels.com/photos/12298301/pexels-photo-12298301.jpeg?cs=srgb&dl=pexels-rsapmech-12298301.jpg&fm=jpg',
      isFeatured: true,
      rating: 4.6,
    },
  });

  await prisma.product.upsert({
    where: { id: 'prod-banano-01' },
    update: {},
    create: {
      id: 'prod-banano-01',
      vendorId: v2.id,
      name: 'Banano Criollo',
      description: 'Bananos maduros y dulces, cosechados en el momento justo.',
      price: 0.25,
      quantity: 500,
      category: 'frutas',
      imageUrl: 'https://www.exoticfruitsusa.com/v/vspfiles/photos/Burro-Bananas12470-2.png?v-cache=1785757634',
      unit: 'unidad',
    },
  });

  // Vendor 3: Apiarios del Valle
  const v3Hash = await bcrypt.hash('vendor123', 12);
  const v3 = await prisma.user.upsert({
    where: { email: 'apiariosvalle@agrimarket.sv' },
    update: {},
    create: {
      email: 'apiariosvalle@agrimarket.sv',
      passwordHash: v3Hash,
      name: 'María Elena Sánchez',
      role: 'vendedor',
      phone: '50373456789',
    },
  });
  await prisma.vendorProfile.upsert({
    where: { userId: v3.id },
    update: {},
    create: {
      userId: v3.id,
      businessName: 'Apiarios del Valle',
      description: 'Miel pura de abeja 100% natural. También vendemos huevos de granja y hierbas frescas.',
      specialty: 'Miel y Productos Apícolas',
      location: 'Chalatenango, El Salvador',
      isFeatured: false,
      rating: 4.9,
    },
  });

  await prisma.product.upsert({
    where: { id: 'prod-miel-01' },
    update: {},
    create: {
      id: 'prod-miel-01',
      vendorId: v3.id,
      name: 'Miel Pura de Abeja',
      description: 'Miel 100% natural, sin procesar. Directa del apiario al frasco.',
      price: 5.00,
      quantity: 50,
      category: 'miel',
      imageUrl: 'https://images.squarespace-cdn.com/content/v1/54ee461ae4b0947228728d76/5b4179c3-be86-4886-8fc7-7f1382336387/IMG_8424.jpeg?format=1500w',
      unit: 'unidad',
    },
  });
  await prisma.product.upsert({
    where: { id: 'prod-huevos-01' },
    update: {},
    create: {
      id: 'prod-huevos-01',
      vendorId: v3.id,
      name: 'Huevos de Granja',
      description: 'Huevos frescos de gallinas criadas al aire libre.',
      price: 3.50,
      quantity: 100,
      category: 'huevos',
      imageUrl: 'https://maalotfarms.org/wp-content/uploads/2025/01/farm-fresh-eggs-varieties.jpg',
      unit: 'docena',
    },
  });
  await prisma.product.upsert({
    where: { id: 'prod-cilantro-01' },
    update: {},
    create: {
      id: 'prod-cilantro-01',
      vendorId: v3.id,
      name: 'Cilantro Fresco',
      description: 'Manojos de cilantro recién cortado.',
      price: 0.25,
      quantity: 200,
      category: 'hierbas',
      imageUrl: 'https://www.seriouseats.com/thmb/wzuSfSqhSMHXGlDQqQOEItQIWgo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2016__09__20160911-knife-skills-herbs-primary-7bbd1f73687e49ef8bd61af9c56d4be1.jpg',
      unit: 'manojo',
    },
  });

  // Vendor 4: Granos y Semillas El Agricultor
  const v4Hash = await bcrypt.hash('vendor123', 12);
  const v4 = await prisma.user.upsert({
    where: { email: 'granosagri@agrimarket.sv' },
    update: {},
    create: {
      email: 'granosagri@agrimarket.sv',
      passwordHash: v4Hash,
      name: 'Roberto Hernández',
      role: 'vendedor',
      phone: '50374567890',
    },
  });
  await prisma.vendorProfile.upsert({
    where: { userId: v4.id },
    update: {},
    create: {
      userId: v4.id,
      businessName: 'Granos y Semillas El Agricultor',
      description: 'Vendemos granos básicos: frijol, maíz, arroz. Todo de cosecha nacional.',
      specialty: 'Granos y Cereales',
      location: 'Usulután, El Salvador',
      coverImage: 'https://cdn.abacus.ai/images/a49f2313-862d-468a-a1d7-774f5766c576.png',
      isFeatured: true,
      rating: 4.5,
    },
  });

  await prisma.product.upsert({
    where: { id: 'prod-frijol-01' },
    update: {},
    create: {
      id: 'prod-frijol-01',
      vendorId: v4.id,
      name: 'Frijol Rojo de Seda',
      description: 'Frijol rojo de seda, cosecha fresca. Excelente para pupusas y casamiento.',
      price: 1.25,
      quantity: 300,
      category: 'granos',
      imageUrl: 'https://cdn.abacus.ai/images/a49f2313-862d-468a-a1d7-774f5766c576.png',
      unit: 'lb',
    },
  });
  await prisma.product.upsert({
    where: { id: 'prod-maiz-01' },
    update: {},
    create: {
      id: 'prod-maiz-01',
      vendorId: v4.id,
      name: 'Maíz Blanco',
      description: 'Maíz blanco para tortillas, tamales y más.',
      price: 0.80,
      quantity: 400,
      category: 'granos',
      unit: 'lb',
    },
  });

  // Sample client user
  const clientHash = await bcrypt.hash('cliente123', 12);
  await prisma.user.upsert({
    where: { email: 'maria.compradora@gmail.com' },
    update: {},
    create: {
      email: 'maria.compradora@gmail.com',
      passwordHash: clientHash,
      name: 'María López',
      role: 'cliente',
      phone: '50375678901',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
