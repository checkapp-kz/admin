import mongoose from "mongoose";

const NEXT_PUBLIC_MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

const connect = async () => {
  try {
    mongoose.connect(NEXT_PUBLIC_MONGODB_URI!, {
      dbName: 'checkapp',
      bufferCommands: true
    })
  } catch (err) {
    console.log("ERROR:", err);
  }
};

export default connect;
