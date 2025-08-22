import mongoose from "mongoose";
import  config  from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoURI, {
    autoIndex: true,
  });
  console.log("✅ MongoDB connected");
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
