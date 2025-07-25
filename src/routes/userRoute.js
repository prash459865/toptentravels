import express from 'express'
import { updateProfile ,fetchAllUsers,updateCity,fetchAllCities,addCity,saveBookings,fetchBookings} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/update-profile',verifyToken,upload.single('profileImage'),updateProfile);
router.post('/fetch-allUsers',verifyToken,fetchAllUsers);
router.post('/update-city',verifyToken,updateCity);
router.get('/fetch-allAvailabble-cities',verifyToken,fetchAllCities);
router.post('/add-city',verifyToken,addCity)
router.post('/save-bookings',verifyToken,saveBookings)
router.get('/fetch-bookings',verifyToken,fetchBookings)

export default router;