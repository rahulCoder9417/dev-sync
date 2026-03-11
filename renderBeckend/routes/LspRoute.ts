import { Request, Response } from "express";

export function LspRoute(req:Request,res:Response) {
    res.json({ ok: true, message: "pong" });
}
