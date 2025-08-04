/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropTable
DROP TABLE "public"."Chat";

-- DropTable
DROP TABLE "public"."Room";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."room" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_slug_key" ON "public"."room"("slug");

-- AddForeignKey
ALTER TABLE "public"."room" ADD CONSTRAINT "room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
