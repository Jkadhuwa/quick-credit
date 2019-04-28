import express from 'express';
import v1 from './apiv1';

const router = express.Router();

router.use('/v1', v1);

export default router;
