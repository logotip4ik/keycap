-- CreateTable
CREATE TABLE "User" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "username" STRING(50) NOT NULL,
    "email" STRING(75) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "title" STRING(150) NOT NULL,
    "content" STRING,
    "parentId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING(50) NOT NULL,
    "root" BOOL NOT NULL DEFAULT false,
    "parentId" INT8 NOT NULL,
    "ownerId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "User"("username", "email");

-- CreateIndex
CREATE INDEX "Note_title_idx" ON "Note"("title");

-- CreateIndex
CREATE INDEX "Folder_name_idx" ON "Folder"("name");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
