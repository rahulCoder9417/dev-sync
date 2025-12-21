import multer from "multer";

export const formParser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 60 * 1024 * 1024, // max zip / payload
  },
});
