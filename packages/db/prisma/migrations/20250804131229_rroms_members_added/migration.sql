/*
  Warnings:

  - You are about to drop the column `capacity` on the `room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."room" DROP COLUMN "capacity",
ADD COLUMN     "currentCapacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalCapacity" INTEGER NOT NULL DEFAULT 50;

-- CreateTable
CREATE TABLE "public"."roomsMembers" (
    "memberId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "roomsMembers_memberId_roomId_key" ON "public"."roomsMembers"("memberId", "roomId");

-- AddForeignKey
ALTER TABLE "public"."roomsMembers" ADD CONSTRAINT "roomsMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roomsMembers" ADD CONSTRAINT "roomsMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
