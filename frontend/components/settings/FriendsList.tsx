import React, { useState } from "react";
import { Button } from "../ui/button";
import { Clock, UserCheck } from "lucide-react";
import Avatar from "../main/Avatar";
import Link from "next/link";
import { handleFriendAction } from "@/lib/actions/friends/friendActions";

interface Friend {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  status: "accepted" | "pending";
}

const FriendsList = ({
  friends,
  acceptedCount,
  pendingCount,
  loading,
  setFriends
}: {
  friends: Friend[];
  acceptedCount: number;
  pendingCount: number;
  loading: boolean;
  setFriends: any;
}) => {
  const [friendFilter, setFriendFilter] = useState<"all" | "accepted" | "pending">("all");

  const filteredFriends = friends.filter(friend => {
    if (friendFilter === "all") return true;
    return friend.status === friendFilter;
  });

  return (
    <div className="p-6 rounded-xl border bg-[#413e4b]" style={{ borderColor: 'hsl(var(--border-primary))' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">Friends List</h2>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className={friendFilter === "all" ? "bg-[#4759f5]" : "bg-primary"}
            onClick={() => setFriendFilter("all")}
          >
            All ({friends.length})
          </Button>

          <Button
            size="sm"
            className={`gap-1 ${friendFilter === "accepted" ? "bg-[#4759f5]" : "bg-primary"}`}
            onClick={() => setFriendFilter("accepted")}
          >
            <UserCheck className="w-3 h-3" />
            Accepted ({acceptedCount})
          </Button>

          <Button
            size="sm"
            className={`gap-1 ${friendFilter === "pending" ? "bg-[#4759f5]" : "bg-primary"}`}
            onClick={() => setFriendFilter("pending")}
          >
            <Clock className="w-3 h-3" />
            Pending ({pendingCount})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted animate-pulse">
          Loading friends...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No friends found in this category
            </div>
          ) : (
            filteredFriends.map(friend => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary border-secondary border hover:bg-opacity-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    fullName={friend.fullName}
                    username={friend.username}
                    avatar={friend.avatar}
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="font-medium text-primary">{friend.fullName}</h3>
                    <p className="text-sm text-muted">@{friend.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {friend.status === "accepted" ? (
                    <span className="flex items-center gap-1 text-sm px-3 py-1 text-green-400 bg-green-400/30 rounded-full">
                      <UserCheck className="w-3 h-3" />
                      Accepted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm px-3 py-1 text-yellow-400 bg-yellow-400/30 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}

                  <Link href={`/profile/${friend.username}`}>
                    <Button size="sm" className="bg-primary text-primary border-primary" variant="outline">
                      View Profile
                    </Button>
                  </Link>
                  <form action={async () => {
                    await handleFriendAction(friend.id, friend.status === "pending" ? "accept" : "unfriend");
                    if (friend.status === "pending") {
                      setFriends((prev: Friend[]) => prev.map((i)=> i.id === friend.id ? {...i, status: "accepted"} : i));
                    } else {
                      setFriends((prev: Friend[]) => prev.filter(f => f.id !== friend.id));
                    }
                  }}>
                    <Button type="submit" size="sm" className="bg-primary cursor-pointer text-primary border-primary" variant="outline">
                      {friend.status === "pending" ? "Accept" : "Unfriend"}
                    </Button>
                  </form>

                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
