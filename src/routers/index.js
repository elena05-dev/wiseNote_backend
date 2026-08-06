import { Router } from "express";
import notesRouter from "./notes.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/notes", notesRouter);
router.use("/api/users", usersRouter);


export default router;
