import dotenv from "dotenv";
import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { getEnvVar } from "./utils/getEnvVar.js";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const PORT = Number(getEnvVar("PORT"));

export const setupServer = () => {
  const app = express();

  app.use(cookieParser());

  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://wise-note-nu.vercel.app",
        "https://notehub-frontend.vercel.app",
      ];

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  };

  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(
    pino({
      transport:
        process.env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    }),
  );

  app.set("trust proxy", 1);

  app.use(
    express.json({
      type: ["application/json", "application/vnd.api+json"],
      limit: "100kb",
    }),
  );

  app.use((req, res, next) => {
    next();
  });

  app.use(router);

  app.use("/", notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
