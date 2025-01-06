import { config } from './config/config.js';
import express from 'express';
import cors from 'cors';
import shopController from './controllers/shopController.js';
import userController from './controllers/userController.js';

const app = express();
const PORT = config.port;
const BASE_URL = config.dbUrl;

app.use(express.json());
app.use('/shop/cards', shopController);
app.use('/users', userController);

app.use(cors({
  origin: 'https://three-3team-favorite-photo-be.onrender.com',
  credentials: true
}));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
