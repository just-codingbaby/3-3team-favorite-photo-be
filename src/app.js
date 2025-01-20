import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from '#config/config.js';
import apiRoutes from '#routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
// import router from './routes/upload.routes.js'; // 업로드 라우터
import createCardRouter from './routes/createcard.routes.js'; // 통합 라우터

const app = express();
const PORT = config.port;
// const BASE_URL = config.dbUrl;

// 로그 기록
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: config.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
console.log('CORS Origins:', corsOptions.origin);

// if (process.env.NODE_ENV === 'development') {
//   // **디버깅 코드 추가 (요청 헤더와 쿠키 출력)**
//   app.use((req, res, next) => {
//     console.log('요청 헤더:', req.headers);
//     console.log('요청 쿠키:', req.cookies);
//     next();
//   });
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = join(__dirname, '../uploads'); // 'uploads' 디렉토리 경로 설정
if (!existsSync(uploadPath)) {
  // 'uploads' 디렉토리가 존재하지 않으면 생성
  mkdirSync(uploadPath);
}
app.use('/uploads', express.static(uploadPath)); // 정적 파일 제공
console.log('Static file directory:', uploadPath);

let swaggerFile;
try {
  swaggerFile = JSON.parse(readFileSync(join(__dirname, './swagger-output.json'), 'utf8'));
} catch (error) {
  console.error('Swagger 파일 로드 중 오류 발생:', error);
  process.exit(1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const API_VERSION = 'v1';
app.use(`/api/${API_VERSION}`, apiRoutes);

// app.use('/api/v1/images', router);
app.use('/api/v1/users', createCardRouter);

app.listen(PORT, () => {
  if (config.env === 'development') {
    console.log(`Server is running on port ${PORT}`);
    console.log(`App is running in ${config.env} mode.`);
  }
});
