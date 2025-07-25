import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const orderId = async(req,res)=>{

    const { amount,currency} = req.body;
   console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET, "orderID hitted");
  try {
    const options = {
      amount: amount * 100,
      currency: currency || 'INR',
      receipt: `receipt_order_${Date.now()}`
    };
   console.log("orderID under")
    const order = await razorpay.orders.create(options);
    console.log(order,'orderId hitted 2')
    res.json({order}); 
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
  }
}