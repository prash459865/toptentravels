import User from "../models/user.js";
import Car from "../models/Cars.js";
import Admin from "../models/admin.js";
import { generateToken } from "../lib/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export const userSignup = async (req, res) => {
  try {
    const {phoneNumber, password, pushToken } = req.body;

    if (!phoneNumber || !password || phoneNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter valid name, 10-digit phone number, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this phone number',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      notificationToken: pushToken || '',
    });

    await newUser.save();

    return res.status(201).json({success: true, message: 'Signup successful'});

  } catch (error) {
    console.error('Error in userSignup:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { phoneNumber, password, pushToken } = req.body;

    if (!phoneNumber || phoneNumber.length !== 10 || !password) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit phone number and password'
      });
    }

    const user = await User.findOne({ phoneNumber }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.', });
    }

    if (user.notificationToken !== pushToken) {
      user.expoPushToken = pushToken;
      await user.save();
    }
    const token = generateToken(user._id);
    return res.status(200).json({ success: true, message: 'Login successful', user, token, });

  } catch (error) {
    console.error('Error in loginSignup:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const uiValidation = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ authenticated: false });
    res.json({ authenticated: true, userId: decoded.userId });
  });
}

export const createAdmin = async (req, res) => {
  try {
    const { phoneNumber, email, password } = req.body;

    if (!phoneNumber || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      phoneNumber,
      email,
      password: hashedPassword
    });

    await newAdmin.save();

    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (admin.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(admin._id);
    console.log(token, 'ffor admin')
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    console.log(admin, 'admin from backend')
    res.status(200).json({ success: true, message: 'Login successful', admin });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


export const fetchData = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    console.log(user, 'from fetchData')

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in fetchData:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const hostLogin = async (req, res) => {
  const { hostId, password ,pushToken} = req.body;
  console.log(pushToken,"host Login")
  try {
    if (!hostId || !password) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
    const host = await Car.findOne({ hostId })

    if (!host) {
      return res.status(401).json({ success: false, message: "Invalid Host ID" });
    }
    const isMatch = await bcrypt.compare(password, host.password);


    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
    if (host.notificationToken !== pushToken) {
      host.notificationToken = pushToken;
      await host.save();
    }
    const hostToken = generateToken(host._id);
    return res.status(200).json({ success: true, message: "Login successful", host, hostToken });

  } catch (error) {
    console.error("Host login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};