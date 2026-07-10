import User from "../models/User.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import Chat from "../models/Chat.js";

const getContactsInvitations = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.status(200).json(user.invitations);
}

const getContacts = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        .populate('contacts.contact', 'username avatar email')
        .populate('contacts.chat');
    res.status(200).json(user.contacts);
}

const postContact = async (req, res) => {
    const { fromUserId } = req.body;
    const user = req.user;

    user.invitations = user.invitations.filter(
        (invitation) => invitation.fromUserId.toString() !== fromUserId
    );

    const alreadyInContacts = user.contacts.some(
        contact => contact.contact.toString() === fromUserId
    );

    const fromUser = await User.findById(fromUserId);

    let chat = await Chat.findOne({
        $and: [
            { members: { $all: [user._id.toString(), fromUserId] } },
            { members: { $size: 2 } }
        ]
    });

    if (!chat) {
        chat = await Chat.create({
            members: [user._id, fromUserId],
            messages: []
        });
    }


    if (!alreadyInContacts) {
        user.contacts.push({
            contact: fromUserId,
            chat: chat._id
        });
    } else {
        const contact = user.contacts.find(c => c.contact.toString() === fromUserId);
        if (contact && !contact.chat) {
            contact.chat = chat._id;
        }
    }

    const alreadyInContactsFromUser = fromUser.contacts.some(
        contact => contact.contact.toString() === user._id.toString()
    );

    if (!alreadyInContactsFromUser) {
        fromUser.contacts.push({
            contact: user._id,
            chat: chat._id
        });
    } else {
        const contact = fromUser.contacts.find(c => c.contact.toString() === user._id.toString());
        if (contact && !contact.chat) {
            contact.chat = chat._id;
        }
    }

    await user.save();
    await fromUser.save();

    const updatedUser = await User.findById(user._id)
        .populate('contacts.contact', 'username avatar email')
        .populate('contacts.chat');

    return res.status(200).json(updatedUser);
};

const rejectContact = async (req, res) => {
    const {fromUserId} = req.body;
    const user= req.user;
    user.invitations  = user.invitations.filter(
        (invitation) => invitation.fromUserId.toString() !== fromUserId
    );
    await user.save();
    return res.status(200).json(user);
}



export default {
    getContactsInvitations:ctrlWrapper(getContactsInvitations),
    postContact:ctrlWrapper(postContact),
    rejectContact:ctrlWrapper(rejectContact),
    getContacts:ctrlWrapper(getContacts),
};