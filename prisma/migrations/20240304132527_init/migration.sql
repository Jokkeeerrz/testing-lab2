-- CreateTable
CREATE TABLE "Pogs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ticker_symbol" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "color" VARCHAR(16) NOT NULL,

    CONSTRAINT "Pogs_pkey" PRIMARY KEY ("id")
);
