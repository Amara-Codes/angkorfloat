const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      content: true
    }
  });
  fs.writeFileSync("db_output_utf8.json", JSON.stringify(posts, null, 2), "utf8");
  console.log("Done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
