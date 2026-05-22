/*
  Warnings:

  - You are about to drop the column `seoData` on the `BlogPost` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnailImage" BLOB,
    "thumbnailUrl" TEXT,
    "thumbnailCaption" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" BLOB,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("authorId", "content", "createdAt", "id", "published", "slug", "thumbnailCaption", "thumbnailUrl", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "published", "slug", "thumbnailCaption", "thumbnailUrl", "title", "updatedAt" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
