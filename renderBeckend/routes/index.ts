import { Router } from "express";
import {db} from "../lib/db/db.js";
import { initializeTerminalProject } from "../controller/diskFileSave.js";
import { AutoCompletionRoute } from "./AutoCompletionRoute.js";
const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

router.post("/terminal/saveFile",initializeTerminalProject);

router.post("/auto-completion/get-completions",
  AutoCompletionRoute
);

export default router;
