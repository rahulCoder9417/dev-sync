import { Router } from "express";
import {db} from "../lib/db/db.js";
import { initializeTerminalProject } from "../controller/diskFileSave.js";
import { LspRoute } from "./LspRoute.js";
const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

router.post("/terminal/saveFile",initializeTerminalProject);

router.post("/lsp/completions",
  LspRoute
);

export default router;
