import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { updateUserController } from "../controllers/auth.js";

console.log("✅ usersRouter loaded from", import.meta.url);

const router = Router();
router.get("/me", authenticate, async (req, res) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers.authorization);
  console.log("Authenticated user:", req.user);
  if (!req.user) {
    console.warn("⚠️ No user found in request!");
    return res.status(401).json({ error: "Not authenticated" });
  }
  const user = req.user;
  res.json({ _id: user._id, name: user.name, email: user.email });
});

router.patch("/me", authenticate, updateUserController);
export default router;
