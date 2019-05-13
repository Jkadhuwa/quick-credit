import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bodyPaser from 'body-parser';
import cors from 'cors';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import Router from './routes/routes';

const swaggerDoc = require('../swagger.json');

dotenv.config();

const environment = process.env.NODE_ENV;
const app = express();
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined', { skip: (req, res) => res.statusCode < 400 }));

// routes
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1', Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
export default app;
