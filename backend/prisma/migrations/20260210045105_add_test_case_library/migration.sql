-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestCaseTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testCaseId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestCaseTag_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TestCaseTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "jira" TEXT,
    "jiraUrl" TEXT,
    "status" TEXT NOT NULL,
    "env" TEXT NOT NULL,
    "notes" TEXT,
    "detailFile" TEXT,
    "testCaseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("createdAt", "date", "detailFile", "env", "feature", "id", "jira", "jiraUrl", "notes", "status", "updatedAt") SELECT "createdAt", "date", "detailFile", "env", "feature", "id", "jira", "jiraUrl", "notes", "status", "updatedAt" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE INDEX "Test_date_idx" ON "Test"("date");
CREATE INDEX "Test_status_idx" ON "Test"("status");
CREATE INDEX "Test_feature_idx" ON "Test"("feature");
CREATE INDEX "Test_testCaseId_idx" ON "Test"("testCaseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TestCase_title_idx" ON "TestCase"("title");

-- CreateIndex
CREATE INDEX "TestCase_priority_idx" ON "TestCase"("priority");

-- CreateIndex
CREATE INDEX "TestCaseTag_testCaseId_idx" ON "TestCaseTag"("testCaseId");

-- CreateIndex
CREATE INDEX "TestCaseTag_tagId_idx" ON "TestCaseTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseTag_testCaseId_tagId_key" ON "TestCaseTag"("testCaseId", "tagId");
