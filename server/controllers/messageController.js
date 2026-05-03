import Message from "../models/Message.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    
    if (!sender || !receiver || !message?.trim()) {
      return res.status(400).json({
        error: "Sender, receiver and message are required",
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message.trim(),
    });

    res.status(201).json(newMessage);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Messages
export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    //  Validation
    if (!sender || !receiver) {
      return res.status(400).json({
        error: "Sender and receiver are required",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};