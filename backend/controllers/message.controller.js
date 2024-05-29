import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    // console.log("Message sent", req.params.id); // id => /send/:id

    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all : [senderId, receiverId]},
        });

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await newMessage.save();
        // await conversation.save();

        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("Error in send Message controller: ", error.message);
        res.status(500).json({error : "Error in send message controller"});
    }
 
}

export const getMessage = async (req, res) => {
    try {

        const senderId = req.user._id;
        const { id : userToChatId } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all : [senderId, userToChatId]},
        }).populate("messages");

        if(! conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    }  catch (error) {
        console.log("Error in Get Message controller: ", error.message);
        res.status(500).json({error : "Error in get message controller"});
    }
}