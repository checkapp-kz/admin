import mongoose from "mongoose";

const NEXT_PUBLIC_MONGODB_URI = 'mongodb+srv://batrbekk:kbekbe031198@main.7lggi.mongodb.net/?retryWrites=true&w=majority&appName=Main';

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
