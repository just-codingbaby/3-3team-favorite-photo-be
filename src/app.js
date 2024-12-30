import express from 'express';
import { config } from './config/config.js'

const app = express();

const PORT = config.port;
const BASE_URL = config.dbUrl;

app.use(express.json());
app.use(cors());
