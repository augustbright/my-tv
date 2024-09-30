-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PROCESSING', 'ERROR', 'DRAFT', 'PUBLISHED', 'DELETED');

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "authorId" TEXT NOT NULL,
    "location" JSONB,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
