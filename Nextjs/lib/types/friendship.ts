
export type FriendAction = 'accept' | 'unfriend';

export interface FriendActionResult {
  success: boolean;
  message: string;
}
export type FriendshipStatus =
  | 'none'
  | 'pending'
  | 'accepted'
  | 'acceptHim'
  | 'blocked'
