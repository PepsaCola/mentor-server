import Chat from "../models/Chat.js";
import User from "../models/User.js";

export default function privateMessage (socket,users,io) {
    socket.on("private_message", async ({ fromUserId, toUserId, message }) => {
        const toSocketId = users.get(toUserId);
        console.log(toUserId);
        console.log(users)
        try {
            let chat = await Chat.findOne({
                $and: [
                    { members: { $all: [fromUserId, toUserId] } },
                    { members: { $size: 2 } }
                ]
            });

            if (!chat) {
                chat = await Chat.create({
                    members: [fromUserId, toUserId],
                    messages: []
                });

                await User.updateOne(
                    { _id: fromUserId, "contacts.contact": toUserId },
                    { $addToSet: { "contacts.$.chat": chat._id } }
                );

                await User.updateOne(
                    { _id: toUserId, "contacts.contact": fromUserId },
                    { $addToSet: { "contacts.$.chat": chat._id } }
                );
            }

            const newMessage = {
                fromUserId,
                message,
                timestamp: new Date()
            };

            await Chat.updateOne(
                { _id: chat._id },
                { $push: { messages: newMessage } }
            );
            console.log(toSocketId,newMessage)
            if (toSocketId) {
                io.to(toSocketId).emit("receive_private_message",newMessage);
            }

        } catch (err) {
            console.error("Error sending private message:", err);
        }
    });

}