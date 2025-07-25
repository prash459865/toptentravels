import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/lib/connectDB.js';
import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import carRoute from './src/routes/carRoute.js'
import benefitplanRoute from './src/routes/benefitPlanRoute.js'
import orderIdRoute from './src/routes/paymentRoute.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); 
 

app.use(cors({
  origin: ['http://localhost:5173'], 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser());
app.use('/', authRoute); 
app.use('/', userRoute); 
app.use('/', carRoute);
app.use('/',benefitplanRoute)
app.use('/',orderIdRoute)

app.listen(PORT, async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log(` Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error(' DB connection failed:', error.message);
    process.exit(1);
  }
});
