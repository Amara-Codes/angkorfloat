const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@angkorfloat.com';
  
  // Find the SUPERADMIN role
  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPERADMIN' }
  });

  if (!superAdminRole) {
    console.error('SUPERADMIN role not found. Please run seed first.');
    return;
  }

  // Set the roles to ONLY SUPERADMIN
  await prisma.user.update({
    where: { email },
    data: {
      roles: {
        set: [{ id: superAdminRole.id }]
      }
    }
  });

  console.log(`Successfully updated ${email} to have only the SUPERADMIN role.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
