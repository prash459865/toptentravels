import User from "../models/user.js";
import Car from "../models/Cars.js";
import City from "../models/city.js";
import cloudinary from "../lib/cloudinary.js";
import axios from 'axios'

export const updateProfile = async (req, res) => {
  try {
    const { selfId, name, email } = req.body;
    let imageURL = '';
    if (!req.file) {
      console.log("profile not provided")
    }
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

      const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'media',
        resource_type: 'auto',
      });

      imageURL = uploadedResponse.secure_url;

    }
    await User.findByIdAndUpdate(selfId, {
      image: imageURL,
      name: name,
      email: email
    })
    return res.status(200).json({ success: true, message: "Profile updated" })
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ success: false, error: "Unable to upadte profile " });
  }
}

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const fetchAllCities = async (req, res) => {
  try {
    const allDocs = await City.find();
    const allCities = allDocs.map(doc => doc.city);

    res.json({ success: true, allCities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateCity = async (req, res) => {
  const { city } = req.body;

  try {
    if (!city) {
      return res.status(400).json({ success: false, message: 'City is required' });
    }

    const userId = req.userId
    await User.findByIdAndUpdate(userId, { city });
    res.status(200).json({ success: true, message: 'City updated successfully' });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addCity = async (req, res) => {
  let { city } = req.body;
  console.log('add city hitted')
  try {
    if (!city || city.trim() === '') {
      return res.status(400).json({ success: false, message: 'City name is required.' });
    }
    const formattedCity = city.trim().toUpperCase();
    const existingCity = await City.findOne({ city: formattedCity });
    if (existingCity) {
      return res.status(200).json({ success: false, message: 'City already added' });
    }
    const newCity = new City({ city: formattedCity });
    await newCity.save();

    return res.status(201).json({ success: true, message: 'City added successfully.', city: newCity });
  } catch (error) {
    console.error('Error adding city:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const saveBookings = async (req, res) => {
  try {
    const { carOwnerId, benefitPlan, formData, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(userId);
    const carOwner = await Car.findById(carOwnerId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!carOwner) {
      return res.status(404).json({ success: false, message: "Car Owner not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const newBookingForUser = {
      from: formData.startDate,
      to: formData.endDate,
      amount,
      benifitPlan: benefitPlan,
      carOwnerName: carOwner.owner,
      carNumber: carOwner.carNumber,
      ownerNumber: carOwner.ownerPhoneNumber,
      carName: carOwner.title,
      status: "Upcoming",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      OTP: otp,
    };
    user.bookings.push(newBookingForUser);
    const savedUser = await user.save();
    const lastBooking = savedUser.bookings[savedUser.bookings.length - 1];
    const bookerBookingId = lastBooking._id;
    const newBookingForHost = {

      from: formData.startDate,
      to: formData.endDate,
      amount,
      benifitPlan: benefitPlan,
      bookingHours: formData.durationHours,
      bookername: user.name,
      bookerId: userId,
      bookerBookingId: bookerBookingId,
      bookerLocation: formData.locationText,
      bookerNumber: user.phoneNumber,
      status: "Upcoming",
      OTP: otp,
    };


    carOwner.bookings.push(newBookingForHost);
    carOwner.isAvailable = false;

    if (carOwner?.notificationToken) {
      await axios.post('https://exp.host/--/api/v2/push/send',
        {
          to: carOwner.notificationToken,
          title: `New Car Booking`,
          body: `${user.name} booked your car from ${new Date(formData.startDate).toLocaleString()} to ${new Date(formData.endDate).toLocaleString()}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await carOwner.save();


    return res.status(201).json({ success: true, message: "Booking saved successfully" });

  } catch (error) {
    console.error("Error saving booking:", error);
    return res.status(500).json({ success: false, message: "Server error while saving booking" });
  }
};

export const fetchBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    user.bookings.forEach(booking => {
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

    await user.save();

    const activeBookings = user.bookings.filter(
      booking => booking.status === 'Upcoming' || booking.status === 'Ongoing'
    );

    return res.status(200).json({ success: true, activeBookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
