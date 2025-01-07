import { config } from './config/config.js';
import express from 'express';
import cors from 'cors';
import shopController from './controllers/shopController.js';
import userController from './controllers/userController.js';

const app = express();
const PORT = config.port;
const BASE_URL = config.dbUrl;

const corsOptions = {
  origin: config.origins,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/shop/cards', shopController);
app.use('/users', userController);

app.listen(PORT, () => {
  if (config.env === 'development') {
    console.log(`Server is running on port ${PORT}`);
    console.log(`App is running in ${config.env} mode.`);
  }
});
