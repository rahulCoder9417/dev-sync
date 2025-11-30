import { Router } from "express";
import {db} from "../lib/db/db.js";
import { initializeTerminalProject } from "../controller/diskFileSave.js";
const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

router.post("/api/terminal/:projectId/:userId",initializeTerminalProject);
export default router;
