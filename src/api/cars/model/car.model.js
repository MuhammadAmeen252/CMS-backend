const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  company:{
    type: String,
    required: [true, "Please enter company of car."],
  },
  name: {
    type: String,
    required: [true, "Please enter car name!"],
    trim: true,
  },
  color: {
    type: String,
    required: [true, "Please select car color!"],
  },
  model: {
    type: Number,
    required: [true, "Please enter car model!"],
  },
  registrationYear: {
    type: Number,
  },
  registrationNumber: {
    type: String,
    unique: [true, "Car already registered with this registration number !"],
    uniqueCaseInsensitive: true,
  },
  engineNumber: {
    type: String,
    required: [true, "Please enter car engine number!"],
    unique: [true, "Car already registered with this engine number !"],
    uniqueCaseInsensitive: true,
  },
  category: {
    type: String,
    required: [true, "Please select car category."],
  },
  topSpeed: {
    type: Number,
  },
  images: {
    type: [String],
  },
},
{
  //to create track of when was created or updated
  timestamps: true,
});

carSchema.index({'engineNumber': 1}, {unique: true, name: "IDX_CAR"});
const Car = mongoose.model("car", carSchema);
module.exports = Car;
