import { ONE_DAY } from "../constants/index.js";

export const setupSession = (res, session) => {
  console.log("Setting session:", session);

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    sameSite: "none", // обязательно для кросс-домена
    secure: process.env.NODE_ENV === "production", // true на проде
    maxAge: ONE_DAY,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_DAY,
  });
};
