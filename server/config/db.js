import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connect("mongodb://localhost:27017/whatsappDemo");
        console.log("MongoDB Connected");
    }
    catch (err) {
        console.log(err)
    }
}

export default connectDB;
