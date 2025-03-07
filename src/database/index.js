import mongoose from "mongoose";

const connectMongoBD = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    // if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    //   throw new Error("Invalid MongoDB URI scheme");
    // }
    const connectionInstance = await mongoose.connect(
      `${mongoUri}/${process.env.MONGO_DB_NAME}`
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