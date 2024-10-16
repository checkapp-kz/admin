import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: 'checkapp',
      bufferCommands: true
    })
  } catch (err) {
    console.log("ERROR:", err);
  }
};

export default connect;
