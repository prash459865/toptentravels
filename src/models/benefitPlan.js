import mongoose from "mongoose";

const benefitPlanSchema = new mongoose.Schema({
    name: { type: String, required: true, enum: ['BASIC', 'MAX', 'PLUS'], },
    type: { type: String, required: true, enum: ['DailyDrive', 'Subscription'], },
    description: { type: String, required: true, },
    amount: { type: Number, required: true, },
}, { timestamps: true });

export default mongoose.model('BenefitPlan', benefitPlanSchema);
