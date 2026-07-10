import express from "express";
import authController from "../controllers/authController.js";
import existingUser from "../midlware/existingUser.js";
import notExistingUser from "../midlware/notExistingUser.js";
import isPasswordValid from "../midlware/isPasswordValid.js";
import authenticate from "../midlware/authenticate.js";

const authRouter = express.Router();

authRouter.post('/register',existingUser,authController.postUser);
authRouter.post('/login',notExistingUser,isPasswordValid,authController.login);
authRouter.get('/',authenticate,authController.getUser);

export default authRouter;