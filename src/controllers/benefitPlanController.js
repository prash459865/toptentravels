import BenefitPlan from "../models/benefitPlan.js";

export const fetchPlans = async (req, res) => {
  try {
    console.log('fetch plans hitted')
    const plans = await BenefitPlan.find();
    res.status(200).json({plans});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editPlans = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = await BenefitPlan.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
