"use client";
import { useEffect, useState } from "react";
import { Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import FriendshipStatus from "@/components/settings/FriendshipStatus";
import Profile from "@/components/settings/Profile";
import FriendsList from "@/components/settings/FriendsList";
import { showToast } from "@/components/main/Toast";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"profile" | "friends">("profile");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const acceptedCount = friends.filter((f: any) => f.status === "accepted").length;
  const pendingCount = friends.filter((f: any) => f.status === "pending").length;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/friend/userFriends");
        const data = await res.json();
        setFriends(data.userFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="min-h-screen flex-1 bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Tabs */}
        <div className="mb-8 flex gap-2 p-1 rounded-xl border items-center justify-center h-14 bg-[#413e4b] w-fit border-primary">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => setActiveTab("profile")}
            className={`gap-2 h-12 text-lg ${activeTab === "profile" ? "bg-[#4759f5]" : ""}`}
          >
            <Upload className="w-6 h-6" />
            Profile Settings
          </Button>

          <Button
            variant={activeTab === "friends" ? "default" : "ghost"}
            onClick={() => setActiveTab("friends")}
            className={`gap-2 h-12 text-lg ${activeTab === "friends" ? "bg-[#4759f5]" : ""}`}
          >
            <Users className="w-6 h-6" />
            Friends
          </Button>
        </div>

        {/* Stats */}
        <FriendshipStatus acceptedCount={acceptedCount} pendingCount={pendingCount} />

        {/* Profile */}
        {activeTab === "profile" && <Profile />}

        {/* Friends */}
        {activeTab === "friends" && (
          <FriendsList
            friends={friends}
            acceptedCount={acceptedCount}
            setFriends={setFriends}
            pendingCount={pendingCount}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
