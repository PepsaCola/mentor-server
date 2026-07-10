import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticate = async (req, res, next) => {
    const {authorization} = req.headers;
    const [bearer, token] = authorization.split(' ');
    if(bearer !== 'Bearer' ) {
        throw HttpError(401,'1');
    }
    try{
        const {id} = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(id)
            .populate('contacts.contact',"username avatar email")
            .populate('contacts.chat');

        if (!user ) {
            throw HttpError(401);
        }
        req.user = user;
        next()
    }catch(err){
        throw HttpError(401,err.message);
    }
}

export default authenticate;