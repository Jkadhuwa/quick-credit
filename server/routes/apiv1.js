import express from 'express';
import path from 'path';

const v1 = express.Router();

v1.use(express.static('UI'));
v1.use('/UI', express.static(path.resolve(__dirname, '../../UI/')));

export default v1;
