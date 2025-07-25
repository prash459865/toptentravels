import mongoose from 'mongoose';

const stateAndCitySchema = new mongoose.Schema({
  city: { type: String, required: true,unique: true  },
});

export default mongoose.model('City', stateAndCitySchema);
