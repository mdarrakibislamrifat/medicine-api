-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "generic" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "indications" TEXT,
    "therapeutic_class" TEXT,
    "pharmacology" TEXT,
    "dosage" TEXT,
    "side_effects" TEXT,
    "pregnancy_category" TEXT,
    "precautions" TEXT,
    "storage_conditions" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_link_key" ON "Medicine"("link");
