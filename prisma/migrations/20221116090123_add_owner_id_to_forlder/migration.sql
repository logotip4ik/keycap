/*
  Warnings:

  - You are about to drop the column `folderId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_folderId_fkey";

-- DropIndex
DROP INDEX "Folder_name_idx";

-- DropIndex
DROP INDEX "User_folderId_key";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "ownerId" INT8 NOT NULL;
ALTER TABLE "Folder" ADD COLUMN     "path" STRING(100) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "folderId";

-- CreateIndex
CREATE UNIQUE INDEX "Folder_ownerId_key" ON "Folder"("ownerId");

-- CreateIndex
CREATE INDEX "Folder_name_ownerId_parentId_idx" ON "Folder"("name", "ownerId", "parentId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
