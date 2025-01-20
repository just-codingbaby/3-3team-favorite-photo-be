-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('CREATED', 'SOLD', 'TRADED');

-- AlterTable: creatorId를 NULL 허용 상태로 추가
ALTER TABLE "Card" 
ADD COLUMN "creatorId" INTEGER,
ADD COLUMN "tradeStatus" "TradeStatus" DEFAULT 'CREATED';

-- 기존 데이터에 creatorId 값을 채우기
UPDATE "Card"
SET "creatorId" = "ownerId"
WHERE "creatorId" IS NULL;

-- creatorId에 NOT NULL 제약 조건 추가
ALTER TABLE "Card"
ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" 
ADD CONSTRAINT "Card_creatorId_fkey" 
FOREIGN KEY ("creatorId") REFERENCES "User"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
