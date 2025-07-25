import Car from "../models/Cars.js";
<<<<<<< HEAD
=======
import User from "../models/user.js";
>>>>>>> f17b687 (updated the code)
import cloudinary from "../lib/cloudinary.js";
import bcrypt from 'bcryptjs'
import axios from "axios"

export const fetchCar = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        if (!phoneNumber || phoneNumber.trim() === "") {
            return res.status(400).json({ message: "Phone number is required" });
        }

        const cars = await Car.find({ ownerPhoneNumber: phoneNumber });

        if (!cars || cars.length === 0) {
            return res.status(404).json({ message: "No cars found for this number" });
        }

        res.status(200).json({ car: cars });
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).json({ message: "Server error while fetching cars" });
    }
};

export const addNewCar = async (req, res) => {
    try {
        const { owner, hostId, password, ownerPhoneNumber, ownerPanCard, ownerAadharCard, carNumber, title, brand, model, variant, fuelType,
            transmission, year, seats, registrationNumber, city, location, pricePerHour, pricePerDay, features, description,
        } = req.body;
        console.log(carNumber, 'from add new car')
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        const uploadedImageUrls = [];

        for (const file of req.files) {
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "car_images" },
                    (error, result) => {
                        if (error) return reject(error);
                        uploadedImageUrls.push(result.secure_url);
                        resolve();
                    }
                );
                stream.end(file.buffer);
            });
        }
        const existingCar = await Car.findOne({
            $or: [{ hostId }, { registrationNumber }],
        });
        if (existingCar) {
            return res.status(409).json({
                success: false,
                message:
                    existingCar.hostId === hostId
                        ? "Host ID already exists"
                        : "Car registration number already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCar = new Car({
            owner, hostId, password: hashedPassword, ownerPhoneNumber, ownerPanCard, ownerAadharCard, carNumber, title, brand,
            model, variant, fuelType, transmission, year, seats, registrationNumber,
            city, location, pricePerHour, pricePerDay,
            features: Array.isArray(features) ? features : features.split(",").map(f => f.trim()),
            description,
            images: uploadedImageUrls,
        });

        await newCar.save();

        res.status(201).json({ success: true, message: "Car added successfully" });

    } catch (error) {
        console.error("Error adding new car:", error);
        res.status(500).json({ message: "Server error while adding car" });
    }
};


export const deleteCar = async (req, res) => {
    const { carId } = req.body;
    if (!carId) {
        return res.status(400).json({ message: "Car ID is required" });
    }
    try {
        const deletedCar = await Car.findByIdAndDelete(carId);

        if (!deletedCar) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Server error while deleting car" });
    }
};

export const availableCars = async (req, res) => {
    const { location } = req.body;

    try {
        const cars = await Car.find({ city: location, isAvailable: true });

        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found in this location" });
        }

        res.status(200).json({ success: true, cars });
    } catch (error) {
        console.error("Error fetching available cars:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const fetchHost = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    try {
        const host = await Car.findById(userId);

        if (!host) {
            return res.status(404).json({ success: false, message: 'Host not found', });
        }

        return res.status(200).json({ success: true, host });
    } catch (error) {
        console.error('Error fetching host:', error);
        return res.status(500).json({ success: false, message: 'Server error', });
    }
};

export const fetchHostBookings = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    try {
        const host = await Car.findById(userId);

        if (!host) {
            return res.status(404).json({ success: false, message: 'Host not found', });
        }

        const now = new Date();
        host.bookings.forEach(booking => {
            const start = new Date(booking.from);
            const end = new Date(booking.to);

            if (now < start) {
                booking.status = "Upcoming";
            } else if (now > end && booking.status === 'Ongoing') {
                booking.status = "Completed";
            } else if (now > end && booking.status === 'Upcoming') {
                booking.status = "Cancelled";
            }

        });
        await host.save();

        return res.status(200).json({ success: true, bookings: host.bookings });
    } catch (error) {
        console.error('Error fetching host:', error);
        return res.status(500).json({ success: false, message: 'Server error', });
    }
}

export const fetchOTP = async (req, res) => {
    const userId = req.userId;
    const { otp, bookingId, bookerId, bookerBookingId } = req.body;

    if (!bookingId || !bookerId || !bookerBookingId) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    try {

        const host = await Car.findById(userId);

        if (!host) {
            return res.status(404).json({ success: false, message: 'Host not found' });
        }

        const matchedBooking = host.bookings.find(
            (booking) => booking._id.toString() === bookingId
        );

        if (!matchedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (matchedBooking.OTP === otp) {
            const booker = await User.findById(bookerId)
            const bookerBooking = booker.bookings.find(
                (booking) => booking._id.toString() === bookerBookingId.toString()
            );
            bookerBooking.status = 'Ongoing'

            matchedBooking.status = 'Ongoing';
            await booker.save();
            await host.save();
            if (booker.notificationToken) {
                await axios.post('https://exp.host/--/api/v2/push/send',
                    {
                        to: booker.notificationToken,
                        title: `New Car Booking`,
                        body: `Your Booking has started!`
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            return res.status(200).json({ success: true, message: 'OTP matched' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
