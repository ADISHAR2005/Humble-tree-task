import Message from "../models/Message.js";

export const sendMessage=async(req,res)=>{
    try{
        const{sender,receiver,message}=req.body;

        const newMessage=await Message.create({
            sender,
            receiver,
            message
        })
        res.json(newMessage);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getMessages=async(req,res)=>{
    try{
        const{sender,receiver}=req.params;
        const messages=await Message.find({
            $or:[
                {sender:sender,receiver:receiver},
                {sender:receiver,receiver:sender}
            ]
        }).sort({timestamp:1})

        res.json(messages);
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}