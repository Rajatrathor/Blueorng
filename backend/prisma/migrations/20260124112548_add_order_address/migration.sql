-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
