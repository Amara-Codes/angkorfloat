import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fetching superadmin to assign as author...')
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@angkorfloat.com' }
  })

  if (!admin) {
    console.log('Superadmin admin@angkorfloat.com not found. Creating a temporary user...')
    admin = await prisma.user.create({
      data: {
        email: 'admin@angkorfloat.com',
        name: 'Super Admin',
        password: 'temporaryhashhere'
      }
    })
  }

  console.log('Ensuring three test categories exist...')
  const categoriesList = ['Wellness', 'Silence', 'Mindfulness']
  const categories = []

  for (const name of categoriesList) {
    const cat = await prisma.postCategory.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    categories.push(cat)
  }

  console.log('Deleting existing test posts to prevent slug collision...')
  // Delete posts starting with our test slug prefix
  const deleteResult = await prisma.blogPost.deleteMany({
    where: {
      slug: {
        startsWith: 'test-article-'
      }
    }
  })
  console.log(`Deleted ${deleteResult.count} old test articles.`)

  console.log('Seeding 35 new test blog posts...')
  for (let i = 1; i <= 35; i++) {
    const title = `Test Article ${i}: The Science of Stillness`
    const slug = `test-article-${i}`
    const caption = `This is a test summary for article number ${i}. In this piece, we explore the deep neurological benefits of sensory deprivation and stillness.`
    const content = `<p>This is the full content of test article number ${i}. Sensorimotor recovery is highly enhanced under absolute sensory silence.</p>`
    
    // Choose categories based on index:
    // i % 3 === 0: 1 category (Wellness)
    // i % 3 === 1: 2 categories (Silence, Mindfulness)
    // i % 3 === 2: all 3 categories
    let selectedCats: { id: string }[] = []
    if (i % 3 === 0) {
      selectedCats = [{ id: categories[0].id }]
    } else if (i % 3 === 1) {
      selectedCats = [{ id: categories[1].id }, { id: categories[2].id }]
    } else {
      selectedCats = [{ id: categories[0].id }, { id: categories[1].id }, { id: categories[2].id }]
    }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        caption,
        content,
        published: true,
        authorId: admin.id,
        categories: {
          connect: selectedCats
        },
        pageTheme: 'blue-coconut'
      }
    })
  }

  console.log('Test seeding of 35 blog posts completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
