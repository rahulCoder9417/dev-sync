
/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type TeamChatItem = {
  type: "team";
  id: string;
  name: string;
  projectId: string;
  memberCount: number;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};

export type DMChatItem = {
  type: "dm";
  id: string;
  userId: string;
  fullName: string;
  username: string;
  avatar: string | null;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};

export type DMAndTeamResult = {
  teams: TeamChatItem[];
  friends: DMChatItem[];
};