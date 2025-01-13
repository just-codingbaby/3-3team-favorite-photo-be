import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/config.js';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './routes/routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = config.port;
const BASE_URL = config.dbUrl;

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

app.listen(PORT, () => {
  if (config.env === 'development') {
    console.log(`Server is running on port ${PORT}`);
    console.log(`App is running in ${config.env} mode.`);
  }
});