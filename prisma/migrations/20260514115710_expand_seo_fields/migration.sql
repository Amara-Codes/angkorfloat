-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "keywords" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogDescription" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogType" TEXT DEFAULT 'article';
ALTER TABLE "BlogPost" ADD COLUMN "robots" TEXT;
