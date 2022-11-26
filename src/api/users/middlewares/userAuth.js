const jwt=require('jsonwebtoken')
const User = require('../model/users.model')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        //now check the token if valid (authenticate the header)
        const decoded=jwt.verify(token,process.env.JWT_USER_CODE)

        //find the user with this id who has that authentication token still stored
        //if the user logs out thus token will not be valid
        const user=await User.findOne({_id:decoded._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        //give the route handler access to the user that we fetch from db
        req.user=user
        //we save token so that if we logout from one device we get login to another
        //i.e route handlers will have acess to that token and we delete a specific token
        req.token=token
        //console.log(req)
        next()
    }
    catch(e){
        e.status = 401
        e.message = 'Sorry! You are not Authorized.'
        next(e)
    }
   
}
module.exports=auth