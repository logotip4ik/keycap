/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "path" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Note_path_key" ON "Note"("path");
