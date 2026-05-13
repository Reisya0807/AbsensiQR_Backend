/*
  Warnings:

  - You are about to drop the column `nip` on the `Sekretaris` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[npm]` on the table `Sekretaris` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Sekretaris_nip_key";

-- AlterTable
ALTER TABLE "Sekretaris" DROP COLUMN "nip",
ADD COLUMN     "npm" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sekretaris_npm_key" ON "Sekretaris"("npm");
