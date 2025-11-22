import dotenv from "dotenv";
import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const PORT = Number(getEnvVar("PORT"));

export const setupServer = () => {
  const app = express();

  app.use(cookieParser());

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "http://localhost:3000",
          "https://notehub-backend-rj4e.onrender.com",
        ];

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.log("CORS blocked for origin:", origin);
          return callback(new Error("Not allowed by CORS"), false);
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

  app.use(
    pino({
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    })
  );

  app.use(
    express.json({
      type: ["application/json", "application/vnd.api+json"],
      limit: "100kb",
    })
  );

  app.options("*", cors(corsOptions));

  app.use(router);

  app.use("/", notFoundHandler);
  app.use(errorHandler);

  console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
  console.log(
    "JWT_SECRET:",
    process.env.JWT_SECRET ? "✅ loaded" : "❌ missing"
  );
  console.log("PORT:", process.env.PORT);

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
