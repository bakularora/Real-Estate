import express from 'express';
import { updateUser,deleteUser,getUserListings,getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRouter=express.Router();

userRouter.post("/update/:id",verifyToken,updateUser); 
userRouter.delete("/delete/:id",verifyToken,deleteUser);
userRouter.get("/listing/:id",verifyToken,getUserListings); 
userRouter.get("/:id",verifyToken,getUser);

export default userRouter;