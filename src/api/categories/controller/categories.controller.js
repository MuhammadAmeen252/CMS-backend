const Car = require("../../cars/model/car.model");
const CarCategory = require("../model/categories.model");

const addCategory = async (req, res, next) => {
  try {
    const isCategoryPresent = await CarCategory.findOne({
      name: req?.body?.name,
    });
    if (isCategoryPresent) {
      throw new Error("Category with this name already exists.");
    }
    const carCategory = new CarCategory(req.body);
    await carCategory.save();
    res.status(200).json({
      message: `Car category has been added successfully!`,
      data: {
        carCategory,
      },
    });
  } catch (e) {
    e.status = 404;
    next(e);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    if (updates.length === 0) throw new Error("Nothing to update.");
    const categoryID = req.params.id;
    const category = await CarCategory.findOne({ _id: categoryID });
    if (!category) {
      throw new Error("No category found!");
    }
    //finding cars with this category and updating them
    const categoryNewName = req.body.name;
    if (categoryNewName && categoryNewName !== category.name) {
      const products = await Car.updateMany(
        { category: category.name },
        { $set: { category: categoryNewName } }
      );
    }
    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();
    res.status(200).json({
      message: `Category has been updated successfully!`,
      data: {
        category,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CarCategory.find({});
    res.status(200).json({
      message: `Categories fetched successfully!`,
      data: {
        categories,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const category = await CarCategory.find({ _id: _id });
    if (category.length == 0) {
      throw new Error("Category not found!");
    }
    res.status(200).json({
      message: `Category fetched successfully!`,
      data: {
        category,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const category = await CarCategory.findOneAndDelete({
      _id: _id,
    });
    if (!category) {
      throw new Error("Category not found!");
    }
    res.status(200).json({
      message: `Category has been deleted successfully!`,
      data: {
        category: category,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
