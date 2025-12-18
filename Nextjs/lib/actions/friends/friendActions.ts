'use server';

import db from '@/lib/db/prisma';
import { middleWare } from '@/lib/mainUtils/beckendMiddleWare';
import { FriendAction, FriendActionResult } from '@/lib/types/friendship';
import { acceptFriend, findFriendship, unfriend } from './utils';

/* -------------------------------------------------------------------------- */
/*                                Action                                      */
/* -------------------------------------------------------------------------- */

export async function handleFriendAction(
  friendId: string,
  action: FriendAction
): Promise<FriendActionResult> {
  const user = await middleWare();
  if (!user) {
    throw new Error('Unauthorized');
  }

  if (!friendId) {
    throw new Error('Friend ID is required');
  }

  const friendship = await findFriendship(user.id, friendId);
  if (!friendship) {
    throw new Error('Friendship not found');
  }

  switch (action) {
    case 'unfriend':
      await unfriend(user.id, friendId, friendship.id);
      return { success: true, message: 'Unfriended' };

    case 'accept':
      await acceptFriend(user.id, friendId, friendship);
      return { success: true, message: 'Accepted' };

    default:
      throw new Error('Invalid action');
  }
}
