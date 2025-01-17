import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from '#config/config.js';
import apiRoutes from '#routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import createCardRouter from './routes/createcard.routes.js'; // 통합 라우터
import router from './routes/upload.routes.js'; // 업로드 라우터

const app = express();
const PORT = config.port;
// const BASE_URL = config.dbUrl;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: config.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.use('/uploads', express.static(join(__dirname, 'uploads'))); // 정적 파일 제공
app.use('/api/v1/images', router);

app.use('/api/v1/users', createCardRouter);

app.listen(PORT, () => {
  if (config.env === 'development') {
    console.log(`Server is running on port ${PORT}`);
    console.log(`App is running in ${config.env} mode.`);
  }
});
