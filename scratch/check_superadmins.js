const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          name: { in: ['SUPERADMIN', 'ADMIN'] }
        }
      }
    },
    include: {
      roles: true
    }
  });

  console.log('Users with Admin/Superadmin roles:');
  admins.forEach(u => {
    console.log(`- ${u.email} (${u.name}): ${u.roles.map(r => r.name).join(', ')}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
