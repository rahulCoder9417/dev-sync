import Chat from "@/components/team/Chat";
import getDMAndTeam from "@/lib/actions/chat/dmAndTeam";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                               Shared Types                                  */
/* -------------------------------------------------------------------------- */

import type { DMAndTeamResult } from "@/lib/types/chat";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                   */
/* -------------------------------------------------------------------------- */

function sortByLastMessage<T extends { lastMessageAt: Date }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                     */
/* -------------------------------------------------------------------------- */

const Page = async () => {
  let data: DMAndTeamResult;

  try {
    data = await getDMAndTeam();

    data = {
      teams: sortByLastMessage(data.teams),
      friends: sortByLastMessage(data.friends),
    };
  } catch {
    return (
      <div className="min-h-screen w-full bg-primary flex flex-col items-center justify-center text-white space-y-4">
        <h1 className="text-2xl font-bold">
          Can't load chats. Please try again.
        </h1>

        <Link href="/dashboard" prefetch>
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return <Chat dmAndTeam={data} />;
};

export default Page;
