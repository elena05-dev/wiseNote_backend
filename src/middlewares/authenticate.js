import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/Session.js";
import { UsersCollection } from "../db/models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, "Not authenticated");
    }

    const session = await SessionsCollection.findOne({
      _id: sessionId,
      refreshToken,
    });
    if (!session) {
      throw createHttpError(401, "Invalid session");
    }

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
      throw createHttpError(401, "Session expired");
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
