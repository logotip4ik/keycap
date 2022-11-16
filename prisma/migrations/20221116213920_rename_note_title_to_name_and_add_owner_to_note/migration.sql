/*
  Warnings:

  - You are about to drop the column `title` on the `Note` table. All the data in the column will be lost.
  - Added the required column `name` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Folder_ownerId_key";

-- DropIndex
DROP INDEX "Note_title_idx";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "title";
ALTER TABLE "Note" ADD COLUMN     "name" STRING(150) NOT NULL;
ALTER TABLE "Note" ADD COLUMN     "ownerId" INT8 NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
