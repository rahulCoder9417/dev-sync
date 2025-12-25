import fs from "fs";

export function getType(absPath) {
  const stat = fs.statSync(absPath);
  return stat.isDirectory() ? "folder" : "file";
}
