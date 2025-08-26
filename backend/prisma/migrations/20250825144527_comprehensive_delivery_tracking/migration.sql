/*
  Warnings:

  - Added the required column `address` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Delivery" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "deliveryHistory" JSONB,
ADD COLUMN     "lastLocation" TEXT,
ADD COLUMN     "recipientName" TEXT NOT NULL,
ADD COLUMN     "recipientPhone" TEXT NOT NULL;
