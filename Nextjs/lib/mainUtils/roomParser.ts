export const makeRoomKey = (projectId: string, fileId?: string | null) =>
    `${projectId}:${fileId ?? ""}`;

export const parseRoomKey = (key: string) => {
    const [projectId, fileId] = key.split(":");
    return { projectId, fileId: fileId === "" ? undefined : fileId };
  };