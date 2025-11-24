import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from "../services/auth.js";
import { UsersCollection as User } from "../db/models/User.js";

import { getUserBySession } from "../services/auth.js";
import { setupSession } from "../utils/session.js";

export const registerUserController = async (req, res) => {
  console.log("Register controller called");
  console.log("📩 Incoming body:", req.body); // <---- ДОБАВЬ ЭТО

  try {
    const user = await registerUser(req.body);
    console.log("User created:", user);
    const session = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("Session created:", session);
    setupSession(res, session);

    res.status(201).json({
      status: 201,
      message: "User registered & logged in!",
      data: {
        user,
        accessToken: session.accessToken,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.status(200).json({
      message: "User logged in successfully!",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    console.error("Login error:", err);

    const message = err.message || "Invalid email or password";

    res.status(401).json({ message });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) await logoutUser(req.cookies.sessionId);

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const getMeController = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId)
      return res.status(401).json({ message: "Not authenticated" });

    const user = await getUserBySession(sessionId);
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshUserSessionController = async (req, res) => {
  console.log("Cookies from client:", req.cookies);

  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUsersSession({ sessionId, refreshToken });

    setupSession(res, session);

    res.json({
      status: 200,
      message: "Session refreshed!",
      data: { accessToken: session.accessToken },
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowedUpdates = ["name", "email"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during update" });
  }
};
