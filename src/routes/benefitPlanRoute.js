import express from 'express'
import { fetchPlans, editPlans } from "../controllers/benefitPlanController.js";
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/edit-plans',verifyToken,editPlans)
router.get('/fetch-plans',verifyToken,fetchPlans)

export default router;