import express from 'express';
import path from 'path';

const router = express.Router();

router.use(express.static('UI'));
router.use('/UI', express.static(path.resolve(__dirname, '../../UI/')));

export default router;
