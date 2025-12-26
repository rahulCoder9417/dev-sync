import crypto from "crypto";
export function verifyPreviewToken(token: string, userId: string, port: string) {
   const secret = process.env.PREVIEW_SECRET || "supersecret";
   const recalculated = crypto
     .createHmac("sha256", secret)
     .update(`${userId}:${port}`)
     .digest("hex");
 
   console.log(`🔐 Token verification: userId=${userId}, port=${port}`);
 
   return recalculated.trim() === token.trim();
 } 