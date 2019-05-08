import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyPaser from 'body-parser';
import cors from 'cors';
import path from 'path';
import Router from './routes/routes';

dotenv.config();
const app = express();
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));

// routes
app.use('/api/v1', Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
export default app;
