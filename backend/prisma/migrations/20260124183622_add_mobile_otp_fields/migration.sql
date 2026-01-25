/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");
