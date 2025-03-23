/*
  Warnings:

  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - Added the required column `name` to the `AvailableAction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "AvailableAction" ADD COLUMN     "name" TEXT NOT NULL;
