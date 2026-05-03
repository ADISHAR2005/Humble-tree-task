import User from "../models/User.js";

//  Login / Create User
export const loginUser = async (req, res) => {
  try {
    let { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        error: "Username is required",
      });
    }

  
    username = username.trim().toLowerCase();


    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({ username });
      return res.status(201).json(user);
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};