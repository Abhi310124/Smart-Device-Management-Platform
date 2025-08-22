import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.js";

const app = express();

// security + parsers
app.use(helmet());
app.use(cors());
app.use(express.json());

// request logs
app.use(morgan("dev"));

// rate limit (apply globally; can also scope per route group)
app.use(apiLimiter);

// mount routes
app.use("/api", routes);

// 404 + error
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
