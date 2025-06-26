import express from 'express';
import {Signin, signup, signingoogle,signout} from '../controllers/auth.controller.js';

const authRouter=express.Router();

authRouter.post("/sign-up",signup);
authRouter.post("/sign-in",Signin);
authRouter.post("/sign-in-google",signingoogle);
authRouter.get("/sign-out",signout);

export default authRouter;
