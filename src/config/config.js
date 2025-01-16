import path from 'path';
// import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path });

/**
 * 환경별 CORS 구성 분리 필요시
 * 아래 코드 적용 후 dotenv -e .env.** -- npx prisma migrate dev && npx prisma generate 실행 필요
 * 참고-https://www.prisma.io/docs/orm/more/development-environment/environment-variables/using-multiple-env-files

 const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });
 **/

export const config = {
  port: process.env.PORT || 8000,
  dbUrl: process.env.DB_URL,
  origins: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development',
};
