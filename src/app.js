import { config } from './config/config.js';
import express from 'express';
import cors from 'cors';
import shopController from './controllers/shopController.js';

const app = express();
const PORT = config.port;
const BASE_URL = config.dbUrl;

app.use(express.json());
app.use(cors());
app.use('/shop/cards', shopController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
