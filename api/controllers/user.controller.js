import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import errorHandler from "../utils/error.js";
import Listing from "../models/listing.model.js";

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id)  
    {
        return next(errorHandler(403,"You can update only your account"));
    }
    try {
        if(req.body.password){
            req.body.password=bcrypt.hashSync(req.body.password,10); 
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,
            {$set:{                       
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar}
            },
            {new:true});  

            const {password,...rest}=updateUser._doc; 
            res.status(200).json(rest); 

    } catch (error) {
        next(error);
    }
};

const deleteUser=async(req,res,next)=>{   
    if(req.user.id !== req.params.id)   
    {
        return next(errorHandler(403,"You can delete only your account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("token");
        res.status(200).json("User deleted successfully")
    } catch (error) {
        next(error);
    }
}

const getUserListings=async(req,res,next)=>{
    if(req.user.id === req.params.id) 
    {
        try {
            const listing=await Listing.find({userRef:req.params.id});
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(403,"You can view only your listings"));
    }
}

const getUser=async(req,res,next)=>{                
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            return next(errorHandler(404,"User not found"));
        }
        const {password:pass,...rest}=user._doc; 
        res.status(200).json(rest);        
    } catch (error) {
        next(error);
    }
    
}

export { updateUser,deleteUser,getUserListings,getUser };