/*
  Warnings:

  - You are about to alter the column `image` on the `Therapist` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "seoData" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "thumbnailCaption" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "thumbnailUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Therapist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "specialties" TEXT NOT NULL,
    "specialties_kh" TEXT,
    "image" BLOB,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Therapist" ("bio", "createdAt", "id", "image", "isActive", "name", "specialties", "updatedAt") SELECT "bio", "createdAt", "id", "image", "isActive", "name", "specialties", "updatedAt" FROM "Therapist";
DROP TABLE "Therapist";
ALTER TABLE "new_Therapist" RENAME TO "Therapist";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
