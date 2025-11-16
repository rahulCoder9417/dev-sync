import React, { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Home, Search, Users, Send, SendHorizonal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateChatPopUp } from "@/lib/redux/features/chatPopUpSlice";
import { dmAndTeam } from "@/app/team/page";
import UserListItem from "./UserListItem";
import Link from "next/link";
import { showToast } from "../main/Toast";
import Avatar from "../main/Avatar";

interface SidebarProps {
  dmAndTeam: dmAndTeam;
  selectedChat: {
    type: "team" | "direct";
    id: string;
    name: string;
  } | null;
  setSelectedChat: (chat: {
    type: "team" | "direct";
    id: string;
    name: string;
  }) => void;
}

const Sidebar = ({ dmAndTeam, selectedChat, setSelectedChat }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const [showFetched, setShowFetched] = useState({ team: false, user: false });

  const [fetchedData, setFetchedData] = useState<null | {
    teams: any[];
    users: any[];
  }>(null);

  // FILTERED RESULTS from original data
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return dmAndTeam.teams;
    const term = searchTerm.toLowerCase();
    return dmAndTeam.teams.filter((team) =>
      team.name.toLowerCase().includes(term)
    );
  }, [dmAndTeam.teams, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return dmAndTeam.friends;
    const term = searchTerm.toLowerCase();
    return dmAndTeam.friends.filter((user) =>
      user.fullName.toLowerCase().includes(term)
    );
  }, [dmAndTeam.friends, searchTerm]);

  // Clear remote results when search input is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      setShowFetched({ team: false, user: false });
      setFetchedData(null);
    }
  }, [searchTerm]);

  const clearSearch = () => setSearchTerm("");

  // ===========================
  // Fetch TEAM Search
  // ===========================
  async function fetchTeams() {
    if (!searchTerm.trim()) return;
    const res = await fetch(`/api/teamSidebar/teamAndUser?type=team&search=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    showToast(true,String(data?.teams) + " teams found");
    setFetchedData((prev) => ({
      teams: data?.teams ?? [],
      users: prev?.users ?? [],
    }));
    setShowFetched({ team: true, user: false });
  }

  // ===========================
  // Fetch USER Search
  // ===========================
  async function fetchUsers() {
    if (!searchTerm.trim()) return;
    const res = await fetch(`/api/teamSidebar/teamAndUser?type=user&search=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setFetchedData((prev) => ({
      teams: prev?.teams ?? [],
      users: data?.users ?? [],
    }));
    setShowFetched({ team: false, user: true });
  }

  // Select correct list source
  const teamsToShow = showFetched.team
    ? fetchedData?.teams ?? []
    : filteredTeams;

  const usersToShow = showFetched.user
    ? fetchedData?.users ?? []
    : filteredUsers;

  return (
    <div className="w-80 bg-card border-r border-primary overflow-y-auto flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-primary">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="hover:bg-hover">
            <Search className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Search users and teams..."
            className="flex-1 mx-3 text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <Button variant="ghost" size="icon" className="hover:bg-hover">
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger
              value="all"
              className="flex-1 cursor-pointer data-[state=inactive]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex-1 cursor-pointer data-[state=inactive]:text-white"
            >
              Unread
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ===== TEAMS SECTION ===== */}
      <ScrollArea className="flex-1 max-h-[35vh] border-b-4 border-primary">
        {teamsToShow.length > 0 ? (
          <div className="p-2 mt-2">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs font-semibold text-secondary uppercase">
                Teams
              </span>
              {searchTerm && (
                <span className="text-xs text-muted-foreground">
                  {teamsToShow.length} found
                </span>
              )}
            </div>

            {teamsToShow.map((team: any) => (
              <div
                key={team.id}
                className="w-auto h-auto relative cursor-pointer hover:bg-hover"
              >
                <button
                  disabled={showFetched.team}
                  onClick={() => {
                    setSelectedChat({
                      type: "team",
                      id: team.id,
                      name: team.name,
                    });
                    clearSearch();
                  }}
                  className={`w-full flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-primary transition-colors ${
                    selectedChat?.type === "team" &&
                    selectedChat.id === team.id
                      ? "bg-hover"
                      : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: "rgba(139,92,246,0.2)" }}
                  >
                    <Users
                      className="h-5 w-5 m-auto mt-2.5"
                      style={{ color: "#8b5cf6" }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-primary">{team.name}</p>
                    <p className="text-xs text-secondary">
                      {team.memberCount ?? 0} members
                    </p>
                  </div>
                </button>

                <Link href={`/projects/get/${team.projectId}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-hover absolute right-10 top-2 cursor-pointer"
                  >
                    <SendHorizonal className="h-5 w-5" />
                  </Button>
                </Link>
{!showFetched.team &&
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-hover absolute right-2 top-2 cursor-pointer"
                  onClick={() =>
                    dispatch(
                      updateChatPopUp({
                        isOpen: true,
                        selectedChat: { type: "team", id: team.id, name: team.name },
                      })
                    )
                  }
                >
                  <Send className="h-5 w-5" />
                </Button>}
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="p-2 mt-4 mx-auto flex items-center justify-center flex-col py-2 text-primary">
            Type Team Name to find a team
            <Button
              onClick={fetchTeams}
              variant="default"
              size="icon"
              className="hover:bg-hover text-pretty mt-3 w-auto px-2"
            >
              Hit me to Find Team
            </Button>
          </div>
        ) : null}
      </ScrollArea>

      {/* ===== USERS SECTION ===== */}
      <ScrollArea className="flex-1">
        {usersToShow.length > 0 ? (
          <div className="p-2 mt-4">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs font-semibold text-secondary uppercase">
                Direct Messages
              </span>
              {searchTerm && (
                <span className="text-xs text-muted-foreground">
                  {usersToShow.length} found
                </span>
              )}
            </div>

            {usersToShow.map((user: any) =>
  showFetched.user ? (
    <div
      key={user.id}
      className="flex items-center justify-between px-3 py-2 hover:bg-hover rounded-lg"
    >
      <div className="flex items-center gap-3">
        <Avatar
          fullName={user.fullName}
          username={user.username}
          avatar={user.avatar}
          getInfo={true}
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-primary">
            {user.fullName}
          </span>
          <span className="text-xs text-secondary">
            @{user.username}
          </span>
        </div>
      </div>
      <Link href={`/profile/${user.username}`}>
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer"
      >
       Go to
      </Button>
      </Link>
    </div>
  ) : (
    <UserListItem
      key={user.id}
      // @ts-ignore
      user={user}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      clearSearch={searchTerm ? clearSearch : undefined}
    />
  )
)}

          </div>
        ) : searchTerm ? (
          <div className="p-2 mt-4 mx-auto flex items-center justify-center flex-col py-2 text-primary">
            Type fullName / username
            <Button
              onClick={fetchUsers}
              variant="default"
              size="icon"
              className="hover:bg-hover text-pretty mt-3 w-auto px-2"
            >
              Hit me to Find Friend
            </Button>
          </div>
        ) : null}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
