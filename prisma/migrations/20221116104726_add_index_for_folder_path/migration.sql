-- DropIndex
DROP INDEX "Folder_name_ownerId_parentId_idx";

-- CreateIndex
CREATE INDEX "Folder_name_path_ownerId_parentId_idx" ON "Folder"("name", "path", "ownerId", "parentId");
