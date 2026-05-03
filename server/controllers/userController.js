import User from "../models/User.js"

export const loginUser=async(req,res)=>{
    try{
        const {username}=req.body;
        let user=await User.findOne({username});
        if(!user){
            user=await User.create({username});
        }

        res.json(user);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};