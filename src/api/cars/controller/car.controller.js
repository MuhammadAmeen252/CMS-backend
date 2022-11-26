const Car = require("../model/car.model");

const addCar = async (req, res, next) => {
  try {
    const car = new Car(req.body);
    const isCarPresent = await Car.findOne({
      $or: [
        { registrationNumber: car.registrationNumber },
        { engineNumber: car.engineNumber },
      ],
    });
    if (isCarPresent) {
      throw new Error("Car already exists.");
    }
    await car.save();
    res.status(200).json({
      message: `Car has been added successfully!`,
      data: {
        car,
      },
    });
  } catch (e) {
    e.status = 404;
    next(e);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    if (updates.length === 0) throw new Error("Nothing to update.");
    const carID = req.params.id;
    const car = await Car.findOne({ _id: carID });
    updates.forEach((update) => (car[update] = req.body[update]));
    await car.save();
    res.status(200).json({
      message: `Car has been updated successfully!`,
      data: {
        car,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find({});
    res.status(200).json({
      message: `Cars fetched successfully!`,
      data: {
        cars,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getCarById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const car = await Car.find({ _id: _id });
    if (car.length == 0) {
      throw new Error("Car not found!");
    }
    res.status(200).json({
      message: `Car fetched successfully!`,
      data: {
        car,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const car = await Car.findOneAndDelete({
      _id: _id,
    });
    if (!car) {
      throw new Error("Car not found!");
    }
    res.status(200).json({
      message: `Car has been deleted successfully!`,
      data: {
        car: car,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  addCar,
  updateCar,
  deleteCar,
  getAllCars,
  getCarById,
};
