import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled','Ongoing'], default: 'Upcoming', required: true },
  amount: { type: String, required: true },
  benifitPlan:{ type: String, required: true },
  carOwnerName:{ type: String, required: true },
  carNumber:{ type: String, required: true },
  ownerNumber:{ type: String, required: true },
  carName:{ type: String, required: true },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  OTP:{ type: String, required: true },
},{timestamps:true})

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Guest', trim: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  image: { type: String, default: null },
  city: { type: String,defauly:''},
  email: { type: String, unique: true },
  offers: { type: [String], default: [] },
  notificationToken: { type: String, unique: true },
  bookings: { type: [bookingSchema], default: [] }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
