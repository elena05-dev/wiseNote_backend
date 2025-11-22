import { Router } from "express";
import notesRouter from "./notes.js";
import authRouter from "./auth.js";
import usersRouter from "./users/route.js";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/notes", notesRouter);
router.use("/api/users/route", usersRouter);

console.log("📡 Routes in router:", Object.keys(router.stack));

export default router;
