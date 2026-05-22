import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Permissions
  const resources = ['blog', 'therapist', 'session', 'package', 'user', 'role', 'faq', 'category']
  const actions = ['create', 'read', 'update', 'delete']
  
  const permissions = []
  for (const resource of resources) {
    for (const action of actions) {
      permissions.push(`${resource}:${action}`)
    }
  }

  // Additional specific permissions if needed
  permissions.push('blog:publish')
  permissions.push('faq:publish')

  console.log('Seeding permissions...')
  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // 2. Create Roles
  console.log('Seeding roles...')
  const allPermissions = await prisma.permission.findMany()

  // Super Admin - All permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {
      permissions: {
        set: allPermissions.map((p) => ({ id: p.id })),
      },
    },
    create: {
      name: 'SUPERADMIN',
      permissions: {
        connect: allPermissions.map((p) => ({ id: p.id })),
      },
    },
  })

  // Content Creator - CRUD on blog posts & faq (excluding publish and delete) and category (excluding delete)
  const contentCreatorPermissions = allPermissions.filter(p => 
    (p.name.startsWith('blog:') && p.name !== 'blog:publish' && p.name !== 'blog:delete') ||
    (p.name.startsWith('faq:') && p.name !== 'faq:publish' && p.name !== 'faq:delete') ||
    (p.name.startsWith('category:') && p.name !== 'category:delete')
  )
  const contentCreatorRole = await prisma.role.upsert({
    where: { name: 'CONTENT_CREATOR' },
    update: {
      permissions: {
        set: contentCreatorPermissions.map((p) => ({ id: p.id })),
      },
    },
    create: {
      name: 'CONTENT_CREATOR',
      permissions: {
        connect: contentCreatorPermissions.map((p) => ({ id: p.id })),
      },
    },
  })

  // Store Manager - CRUD on blog, therapists, categories; READ on sessions, packages
  const storeManagerPermissions = allPermissions.filter(p => 
    p.name.startsWith('blog:') || 
    p.name.startsWith('therapist:') || 
    p.name.startsWith('category:') || 
    p.name === 'session:read' || 
    p.name === 'package:read'
  )
  const storeManagerRole = await prisma.role.upsert({
    where: { name: 'STORE_MANAGER' },
    update: {
      permissions: {
        set: storeManagerPermissions.map((p) => ({ id: p.id })),
      },
    },
    create: {
      name: 'STORE_MANAGER',
      permissions: {
        connect: storeManagerPermissions.map((p) => ({ id: p.id })),
      },
    },
  })

  // 3. Create Super Admin User
  console.log('Seeding super admin...')
  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@angkorfloat.com' },
    update: {
      password: passwordHash,
      roles: {
        set: [{ id: superAdminRole.id }],
      },
    },
    create: {
      email: 'admin@angkorfloat.com',
      name: 'Super Admin',
      password: passwordHash,
      roles: {
        connect: [{ id: superAdminRole.id }],
      },
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
