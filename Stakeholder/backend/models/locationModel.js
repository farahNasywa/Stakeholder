import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  name: String
});

const citySchema = new mongoose.Schema({
  name: String,
  districts: [districtSchema]
});

const provinceSchema = new mongoose.Schema({
  name: String,
  cities: [citySchema]
}, {
  timestamps: true
});

const Location = mongoose.model("Location", provinceSchema);
export default Location;
