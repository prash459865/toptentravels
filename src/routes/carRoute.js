import express from 'express'
import { fetchCar,addNewCar,deleteCar,availableCars,fetchHost,fetchHostBookings,fetchOTP } from '../controllers/carController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/search-car-from-Number',verifyToken,fetchCar);
router.post('/add-new-car',verifyToken, upload.array('images', 5),addNewCar)
router.post('/delete-car',verifyToken,deleteCar);
router.post('/availabe-cars',verifyToken,availableCars);
router.get('/fetch-car-host',verifyToken,fetchHost)
router.get('/fetch-host-bookings',verifyToken,fetchHostBookings)
router.post('/verify-otp',verifyToken,fetchOTP)


export default router;