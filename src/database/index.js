import mongoose from "mongoose";

const connectMongoBD = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    const connectionInstance = await mongoose.connect(
      `${mongoUri}/${process.env.MONGOBD_DB_NAME}`
    );
    console.log(
      "MongoDB connection Success",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection Issue ", error);
  }
};

export default connectMongoBD;