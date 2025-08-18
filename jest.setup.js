import { connectDB, disconnectDB } from "./src/config/db.js"; // adjust path if needed

beforeAll(async () => {
  await connectDB();
  console.log("MongoDB connected for tests");
});

afterAll(async () => {
  await disconnectDB();
  console.log("MongoDB disconnected after tests");
});
