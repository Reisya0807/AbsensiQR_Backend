/*
  Warnings:

  - You are about to drop the column `portofolio` on the `Peserta` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('PESERTA', 'KEJUARAAN', 'PEMATERI');

-- AlterTable
ALTER TABLE "Peserta" DROP COLUMN "portofolio";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "certificateType" "CertificateType" NOT NULL,
    "softFile" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "pesertaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "pesertaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_pesertaId_idx" ON "Certificate"("pesertaId");

-- CreateIndex
CREATE INDEX "Certificate_eventId_idx" ON "Certificate"("eventId");

-- CreateIndex
CREATE INDEX "Certificate_certificateType_idx" ON "Certificate"("certificateType");

-- CreateIndex
CREATE INDEX "Portfolio_pesertaId_idx" ON "Portfolio"("pesertaId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_pesertaId_fkey" FOREIGN KEY ("pesertaId") REFERENCES "Peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_pesertaId_fkey" FOREIGN KEY ("pesertaId") REFERENCES "Peserta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
