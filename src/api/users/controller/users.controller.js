const User = require('../model/users.model')
const notification = require('../../notifications/index')
const bcrypt = require("bcryptjs");

const index = async (req,res,next) => {
    
    try{
        res.status(200).json({
            message:`Welcome to CMS.`,
            data:{
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const registerUser = async (req,res,next) => {
    
    const user=new User(req.body)
    try{
        const isUserPresent = await User.findOne({email: user.email})
        if(isUserPresent){
            throw new Error("User already exists with this email!")
        }
        const randomUserPassword = user.generateRandomPassword()
        user.password = randomUserPassword
        await user.save()
        const token = await user.generateAuthToken()
        //send registration mail
        const subject = 'New User Registration'
        const message = `Thank you for creating your account on Car App.<br>
        Now you are a part of our family. You can login to your account from below credentails.
        <br>
        <p>Email: </p> <strong>${user.email}</strong> 
        <p>Password: </p> <strong>${randomUserPassword}</strong> 
        <br><strong>Thank you again for your time.</strong>`
        notification.sendNotificationMail(user.email,subject,message,user.name)
        res.status(201).json({
            message:`${user.name} you are registered successfully.`,
            data:{
                user: user,
                password: randomUserPassword,
                token: token
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const loginUser = async (req, res, next) => {
    try{
        const user=await User.findByCredientials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        await user.save()
        res.json({
            message:`You are logged in successfully!`,
            data:{
                user: user,
                token:token
            }
        })
    }
    catch(e){
            e.status = 404
            next(e)
    }
}

const logoutUser = async(req, res, next) => {
    try{
        // it remove the token of device from which u logged in
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            //if tokens.token !== req.token it returns false filtering it out
            return tokens.token !== req.token
        })
        await req.user.save()
        res.status(200).json({
            message:`Logged out from the device successfully!`,
            data:{
                email: req.user.email
            }
        })
    }
    catch(e){
        e.status = 500
        next(e)
    }
}

const deleteMyAccount = async(req, res, next) => {
    try{  
        await req.user.remove()
        res.status(200).json({
            message:`Account has been Deleted successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        res.status(500).send(e.message)
    }
}

const updateProfile = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        if(updates.length === 0) throw new Error("Nothing to update.")
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        return res.status(200).json({
            message:`User Profile has been updated successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewMyProfileInfo = async (req, res, next) => {
    try{
        const _id = req.user._id
        const user = await User.find({_id: _id})
        if(user.length == 0){
            throw new Error('No user find of this id !')
        }
        res.status(200).json({
            message:`User fetched successfully!.`,
            data:{
                user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const changePassword = async(req, res, next) => {
    try{
        const user = req.user
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const isMatch= await bcrypt.compare(oldPassword,user.password)
        if(!isMatch || !oldPassword || !newPassword){
        throw new Error('Invalid password Entered!')
        }
        //update password
        user['password'] = newPassword
        await user.save()
        //send change password mail here
        return res.status(200).json({
            message:`User Password has been updated successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    deleteMyAccount,
    updateProfile,
    changePassword,
    viewMyProfileInfo,
    index
}