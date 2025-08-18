import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(ENV.MONGO_URI, {
    autoIndex: true,
  });
  console.log("✅ MongoDB connected");
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
