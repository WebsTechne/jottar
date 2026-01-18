-- CreateEnum
CREATE TYPE "ShareLinkType" AS ENUM ('USERNAME', 'TOKEN');

-- AlterTable
ALTER TABLE "note" ADD COLUMN     "allowCopy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "copiedFromNoteId" UUID,
ADD COLUMN     "copiedFromUserId" UUID,
ADD COLUMN     "shareLinkType" "ShareLinkType" NOT NULL DEFAULT 'USERNAME',
ADD COLUMN     "shareable" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "note_userId_folderId_idx" ON "note"("userId", "folderId");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_copiedFromNoteId_fkey" FOREIGN KEY ("copiedFromNoteId") REFERENCES "note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_copiedFromUserId_fkey" FOREIGN KEY ("copiedFromUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
