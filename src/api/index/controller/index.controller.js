const Cars = require('../../cars/model/car.model')
const Categories = require('../../categories/model/categories.model')
const Users = require('../../users/model/users.model')

const index = async (req,res,next) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const usersCount = await Users.countDocuments({})
    const carsCount = await Cars.countDocuments({})
    const carsCategoriesCount = await Categories.countDocuments({})
    const todayAddedCarsCount = await Cars.countDocuments({
        createdAt: {$gte: today}
    })
    try{
        res.status(200).json({
            message:`Welcome to CMS.`,
            data:{
                usersCount,
                carsCount,
                carsCategoriesCount,
                todayAddedCarsCount
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    index
}