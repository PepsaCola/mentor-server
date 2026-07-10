import User from "../models/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";

const isPasswordValid = async (req,res,next) => {
    const {password,email} = req.body;
    const user = await User.findOne({email});
    const isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        next(HttpError(400, 'Invalid credentials'));
    }
    next()
}
export default isPasswordValid;