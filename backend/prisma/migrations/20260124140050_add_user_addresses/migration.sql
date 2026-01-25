-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingAddressLine1" TEXT,
ADD COLUMN     "billingAddressLine2" TEXT,
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT,
ADD COLUMN     "billingPostalCode" TEXT,
ADD COLUMN     "billingState" TEXT,
ADD COLUMN     "shippingAddressLine1" TEXT,
ADD COLUMN     "shippingAddressLine2" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ADD COLUMN     "shippingPostalCode" TEXT,
ADD COLUMN     "shippingState" TEXT;
