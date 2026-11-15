-- CreateTable
CREATE TABLE "FounderProfile" (
    "key" TEXT NOT NULL,
    "photo" TEXT,
    "role" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "qualifications" TEXT NOT NULL DEFAULT '',
    "alsoOffered" TEXT,
    "linkedin" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FounderProfile_pkey" PRIMARY KEY ("key")
);

