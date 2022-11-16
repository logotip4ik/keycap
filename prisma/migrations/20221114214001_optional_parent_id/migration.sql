-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentId_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "parentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
