/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_path_key" ON "Folder"("path");
