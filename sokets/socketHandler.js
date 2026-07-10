import User from "../models/User.js";
import privateMessage from "./privateMessage.js";
import registerSignaling from "./video/signaling.js";

const users = new Map()

export default function socketHandler(io) {
    io.on("connection", socket => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });
        socket.on('register',(userId)=>{
            users.set(userId, socket.id);
        })

        privateMessage(socket,users,io);
        registerSignaling(io, users, socket);

        socket.on("send_message", (data) => {
            const { roomId, message,from } = data;
            io.to(roomId).emit("receive_message", {from,message});
        });
        socket.on('send_contacts_request', async ({fromUserId,fromName,toUserId}) => {
            try{

                const recipient = await User.findById(toUserId);

                if (!recipient) {
                    return console.error('User not found');
                }

                const alreadyInContacts = recipient.contacts?.some(
                    c => c.contact.toString() === fromUserId
                );

                if (alreadyInContacts) {
                    return console.log('User is already in contacts');
                }

                const alreadyInvited = recipient.invitations?.some(
                    invite => invite.fromUserId.toString() === fromUserId
                );

                if (alreadyInvited) {
                    return console.log('Invitation already sent');
                }

                await User.findOneAndUpdate(
                {_id: toUserId },
                {$push:{
                        invitations:{
                            fromUserId,
                            fromName,
                        }
                    }},
                    {new:true}
                )
                const toSocketId = users.get(toUserId);
                if (toSocketId) {
                    io.to(toSocketId).emit("new_invitation", {fromUserId,fromName});
                }
            }
            catch (error) {
                console.error('Invitation error',error);
            }
        })

        socket.on('accept_contact_request', async ({ fromUserId, toUserId }) => {
            try {
                const fromUser = await User.findById(fromUserId);
                const toUser = await User.findById(toUserId);

                if (!fromUser || !toUser) return;

                const fromSocketId = users.get(fromUserId);
                const toSocketId = users.get(toUserId);

                if (fromSocketId) {
                    io.to(fromSocketId).emit('contacts_updated');
                }
                if (toSocketId) {
                    io.to(toSocketId).emit('contacts_updated');
                }

            } catch (err) {
                console.error("Error accepting contact request:", err);
            }
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
            console.log('Current users after disconnect:', users);
        });
    })

}
