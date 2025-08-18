import request from "supertest";
import app from "../app.js";  // your Express app

jest.setTimeout(20000); 
describe("Auth API", () => {
  const testEmail = `user${Date.now()}@example.com`; // unique email every run
 
  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
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
      .post("/auth/login")
      .send({
        email: testEmail,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", testEmail);

  });
});
