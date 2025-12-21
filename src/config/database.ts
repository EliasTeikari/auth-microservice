import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/auth-microservice";
    mongoose
      .connect(mongoURI)
      .then(() => console.log("Connected to database"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Did not connect to database");
    process.exit(1);
  }
};

export default connectDB;

