import express from 'express'
import { orderId } from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/craete-orderId',verifyToken,orderId);


export default router;