import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.blogPost.count();
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true }
  });
  console.log(`Total blog posts: ${count}`);
  console.log("Posts:", JSON.stringify(posts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
