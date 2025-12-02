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
        console.log("CORS blocked for origin:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  };

  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));

  // express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true, // HTTPS обязательно
        sameSite: "none", // кросс-домен
        maxAge: 24 * 60 * 60 * 1000,
      },
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

  app.set("trust proxy", 1);

  app.use(
    express.json({
      type: ["application/json", "application/vnd.api+json"],
      limit: "100kb",
    })
  );

  app.use((req, res, next) => {
    console.log("Cookies received:", req.cookies); // <- здесь увидишь куки
    next();
  });

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
