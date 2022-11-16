/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[folderId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folderId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_ownerId_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "folderId" INT8 NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_folderId_key" ON "User"("folderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
