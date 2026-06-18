import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@helios.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminName = process.env.ADMIN_NAME || 'Helios Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: Role.ADMIN,
      },
    });
    console.log(`Created default admin user: ${admin.email}`);
  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }

  // Seed default farms
  const farmCount = await prisma.farm.count();
  if (farmCount === 0) {
    await prisma.farm.createMany({
      data: [
        { name: 'Nevada Solar One', location: 'Nevada, USA', capacityKw: 64000, status: 'ONLINE' },
        { name: 'Kamuthi Solar Power Project', location: 'Tamil Nadu, India', capacityKw: 648000, status: 'ONLINE' },
        { name: 'Ouarzazate Solar Power Station', location: 'Drâa-Tafilalet, Morocco', capacityKw: 510000, status: 'ONLINE' },
      ],
    });
    console.log('Seeded default solar farms.');
  } else {
    console.log('Solar farms already exist. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
