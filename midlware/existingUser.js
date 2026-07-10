import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const existingUser = async (req,res,next) => {
    const email = req.body.email;
    const isUser = await User.findOne({ email });
    if (isUser) {
        return next(HttpError(400, 'User already exists'));
    }
    next()
}
export default existingUser;