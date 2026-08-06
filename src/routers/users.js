import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { updateUserController } from "../controllers/auth.js";

const router = Router();
router.get("/me", authenticate, async (req, res) => {
  if (!req.user) {
 
    return res.status(401).json({ error: "Not authenticated" });
  }
  const user = req.user;
  res.json({ _id: user._id, name: user.name, email: user.email });
});

router.patch("/me", authenticate, updateUserController);
export default router;
