import bcrypt from "bcryptjs"; // заменили bcrypt на bcryptjs
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/User.js";
import { SessionsCollection } from "../db/models/Session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import mongoose from "mongoose";

// регистрация пользователя
export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) throw createHttpError(409, "Email in use");

  // хешируем пароль через bcryptjs
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// логин пользователя
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, "User not found");

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, "Invalid password");

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const newSession = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return newSession;
};

// логаут
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// создаём новую сессию
const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

// обновление сессии
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const objectId = mongoose.Types.ObjectId.createFromHexString(sessionId);

  const session = await SessionsCollection.findOne({
    _id: objectId,
    refreshToken,
  });

  if (!session) {
    console.log("⚠️ Session not found in DB:", { sessionId, refreshToken });
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired)
    throw createHttpError(401, "Session token expired");

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: session._id, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

// получение пользователя по сессии
export const getUserBySession = async (sessionId) => {
  const session = await SessionsCollection.findById(sessionId);
  if (!session) throw createHttpError(401, "Invalid session");

  const user = await UsersCollection.findById(session.userId);
  if (!user) throw createHttpError(401, "User not found for this session");

  return user;
};
