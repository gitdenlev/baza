-- CreateTable
CREATE TABLE "FileShareLink" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "role" "SharePermission" NOT NULL DEFAULT 'VIEWER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileShareLink_tokenHash_key" ON "FileShareLink"("tokenHash");

-- CreateIndex
CREATE INDEX "FileShareLink_fileId_idx" ON "FileShareLink"("fileId");

-- AddForeignKey
ALTER TABLE "FileShareLink" ADD CONSTRAINT "FileShareLink_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
