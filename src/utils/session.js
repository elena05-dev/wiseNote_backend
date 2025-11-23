import { ONE_DAY } from "../constants/index.js";

export const setupSession = (res, session) => {
  console.log("Setting session:", session);
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    secure: isProduction, // должно быть true на Render (https)
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_DAY,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ONE_DAY,
  });
};
