import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled','Ongoing'], default: 'Upcoming', required: true },
  bookername: { type: String, required: true },
  bookingHours: { type: String, required: true },
  bookerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookerBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  bookerLocation: { type: String, required: true },
  bookerNumber: { type: String, required: true },
  amount: { type: String, required: true },
  benifitPlan:{ type: String,required: true },
  OTP:{ type: String, required: true },
},{timestamps:true})


const carSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  hostId: { type: String,unique: true },
  password: { type: String},
  carNumber: { type: String,unique: true },
  ownerPhoneNumber: { type: String, required: true },
  ownerPanCard: { type: String, required: true },
  ownerAadharCard: { type: String, required: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  variant: { type: String },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG'], required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
  year: { type: Number, required: true },
  seats: { type: Number, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  location: { type: String },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number },
  features: { type: [String], default: [] },
  description: { type: String },
  images: { type: [String], required: true },
  isAvailable: { type: Boolean, default: true },
  isCancellationAvailable: { type: Boolean, default: false },
  reviews: { type: [reviewSchema], default: [] },
  bookings: { type: [bookingSchema], default: [] },
  notificationToken: { type: String, unique: true,default:'' },

}, { timestamps: true });

export default mongoose.model("Car", carSchema);
