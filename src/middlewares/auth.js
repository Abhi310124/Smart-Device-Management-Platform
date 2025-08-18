import jwt from "jsonwebtoken";

// Middleware to authenticate JWT tokens
async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Expect: Bearer <token>
  if (!token) {
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: err.message });
  }
}

export { authMiddleware };
