import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contacts:[
            {
                contact:{type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
                chat:{type: mongoose.Schema.Types.ObjectId, ref: "Chat"}
            }
        ],
    invitations:[
        {
            fromName:String,
            fromUserId: {type:mongoose.Schema.Types.ObjectId,required: true , ref:"User"},
            createdAt: {type:Date, default:Date.now},
        }
    ],
    avatar:{
        type: String,
    }
})

export default  mongoose.model('User', userSchema);