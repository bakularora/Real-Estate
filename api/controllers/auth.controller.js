import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import errorHandler from '../utils/error.js';

const signup= async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashedPassword=bcrypt.hashSync(password,10);

    const newUser=new User({
        username,
        email,
        password:hashedPassword});

    try{
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch(err) {
        next(err);
    }
};      

const Signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if(!validUser){
            return next(errorHandler(401,"User not found"));
        }
        const validPassword=bcrypt.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,"Invalid Credentials"));
        }
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET); 
        const {password:pass,...rest}=validUser._doc;    
        res
            .cookie("token",token,{httpOnly:true})
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}

const signingoogle=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email});
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET); 
            const {password:pass,...rest}=user._doc;  
            res
                .cookie("token",token,{httpOnly:true})
                .status(200)
                .json(rest);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
            const hashedPassword=bcrypt.hashSync(generatedPassword,10);
            const newUser=new User({
                username:req.body.name.split(" ").join("").toLowerCase(),   
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo});
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET); 
            const {password:pass,...rest}=newUser._doc;
            res
                .cookie("token",token,{httpOnly:true})
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};

export {signup,Signin,signingoogle,signout};
