import mongoose from "mongoose";

const connectMOngoBD = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`
    );
    console.log(
      "MongoDB connection Success",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection Issue ", error);
  }
};

export default connectMOngoBD;