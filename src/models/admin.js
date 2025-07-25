import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  password:{type:String,required: true},
  phoneNumber: { type: String, required: true, unique: true },
  email:{ type: String, required: true,unique: true},
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
