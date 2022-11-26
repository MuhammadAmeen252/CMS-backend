const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

const carCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name!"],
    trim: true,
	lowercase: true,
    unique: [true, "Category already exists."],
	index: true,
	uniqueCaseInsensitive: true,
    validate(str) {
      if (!validator.isByteLength(str, { min: 3, max: 30 })) {
        throw new Error("Category must be between 3 to 30 characters long!");
      }
    },
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

carCategorySchema.plugin(uniqueValidator, {
  message: "{PATH} already exists!",
});

const CarCategory = mongoose.model("CarCategory", carCategorySchema);
module.exports = CarCategory;
