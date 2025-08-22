import request from "supertest";
import app from "../app.js"; // your Express app

jest.setTimeout(20000); 
describe("Auth API", () => {
  const testEmail = `user${Date.now()}@example.com`; // unique email every run
  
  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: testEmail,
        password: "123456",
        role: "user"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    // ** THE FIX: Check for accessToken inside the data object **
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data.user).toHaveProperty("email", testEmail);
  });
});
