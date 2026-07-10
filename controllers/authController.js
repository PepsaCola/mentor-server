import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const postUser = async (req, res) => {
    const { username, password, avatar, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password:hashedPassword,
        email,
        avatar,
        contacts:[]
    }
    const result = await User.create(newUser);
    res.status(201).json({result})
}

const login = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email})
        .populate('contacts.contact',"username avatar email")
        .populate('contacts.chat');
    const payload = {id:user._id}
    const token = jwt.sign(payload, process.env.SECRET_KEY,{expiresIn: '2h'})
    console.log(token, user)
    res.json({accessToken:token,user})
}

const getUser = async (req, res) => {
    const user = await User.findOne({email:req.user.email})
    res.json(user)
}

export default {
    postUser:ctrlWrapper(postUser),
    login:ctrlWrapper(login),
    getUser:ctrlWrapper(getUser),
}