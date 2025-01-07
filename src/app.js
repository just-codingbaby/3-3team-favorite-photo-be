import { config } from './config/config.js';
import express from 'express';
import cors from 'cors';
import shopController from './controllers/shopController.js';
import userController from './controllers/userController.js';

const app = express();
const PORT = config.port;
const BASE_URL = config.dbUrl;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://3-3team-favorite-photo-fe.vercel.app'],
    credentials: true,
  }),
);

app.use(express.json());
app.use('/shop/cards', shopController);
app.use('/users', userController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
