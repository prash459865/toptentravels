import express from 'express'
import { userLogin,userSignup,fetchData,adminLogin,uiValidation , createAdmin,hostLogin} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/user-login',userLogin);
router.post('/user-signup',userSignup);
router.post('/admin-login',adminLogin);
router.post('/host-login',hostLogin);
router.post('/create-new-admin',createAdmin);
router.get('/api/uiValidation',uiValidation);
router.post('/fetchData',verifyToken,fetchData);

export default router;