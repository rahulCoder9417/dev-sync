
const FILE_EXTENSIONS = {
    IMAGE: ["png", "jpg", "jpeg", "gif", "webp"],
    VIDEO: ["mp4", "mov", "avi", "mkv", "webm"],
    AUDIO: ["mp3", "wav", "ogg"],
    DOCUMENT: ["pdf", "docx", "pptx", "xlsx"],
  } as const;

  export const getResourceType = (
    ext: any
  ): "image" | "video" | "raw" | null => {
    if (FILE_EXTENSIONS.IMAGE.includes(ext)) return "image";
    if (FILE_EXTENSIONS.VIDEO.includes(ext) || FILE_EXTENSIONS.AUDIO.includes(ext))
      return "video";
    if (FILE_EXTENSIONS.DOCUMENT.includes(ext)) return "raw";
    return null;
  };
  