// import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyPaser from 'body-parser';
import cors from 'cors';
import path from 'path';
import Router from './routes/routes';

const app = express();
app.use('/api', Router);
app.use(cors());
app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(bodyPaser.json());
const PORT = process.env.PORT || 3000;
export default app;
app.listen(PORT);
