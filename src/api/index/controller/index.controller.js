const Cars = require("../../cars/model/car.model");
const Categories = require("../../categories/model/categories.model");
const Users = require("../../users/model/users.model");

const index = async (req, res, next) => {
  const usersCount = await Users.countDocuments({});
  const carsCategoriesCount = await Categories.countDocuments({});
  try {
    res.status(200).json({
      message: `Welcome to CMS.`,
      data: {
        usersCount,
        carsCategoriesCount,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  index,
};
