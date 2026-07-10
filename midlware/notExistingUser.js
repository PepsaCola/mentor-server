import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";

const notExistingUser = async (req, res, next) => {
    const  {email}= req.body;
    const user = await User.findOne({email});
    if (!user) {
        return HttpError(404, 'User not found');
    }
    next()
}

export default notExistingUser;