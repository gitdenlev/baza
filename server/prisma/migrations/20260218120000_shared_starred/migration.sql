ALTER TABLE "FileShare" ADD COLUMN "isStarred" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "FileShare_sharedWithId_isStarred_idx" ON "FileShare"("sharedWithId", "isStarred");
