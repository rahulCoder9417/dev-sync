import React, { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, Users, Send, SendHorizonal, X, ChevronLeft, Menu } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateChatPopUp } from "@/lib/redux/features/chatPopUpSlice";
import UserListItem from "./UserListItem";
import Link from "next/link";
import { showToast } from "../main/Toast";
import Avatar from "../main/Avatar";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type TeamChatItem = {
  type: "team";
  id: string;
  name: string;
  projectId: string;
  memberCount: number;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};

type DMChatItem = {
  type: "dm";
  id: string;
  userId: string;
  fullName: string;
  username: string;
  avatar: string | null;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};

type DMAndTeamResult = {
  teams: TeamChatItem[];
  friends: DMChatItem[];
};

interface SidebarProps {
  dmAndTeam: DMAndTeamResult;
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

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const Sidebar = ({ dmAndTeam, selectedChat, setSelectedChat }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [searchMode, setSearchMode] = useState<"local" | "global">("local");
  const [showFetched, setShowFetched] = useState({ team: false, user: false });
  const [fetchedData, setFetchedData] = useState<null | {
    teams: any[];
    users: any[];
  }>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter by search and unread status
  const filteredTeams = useMemo(() => {
    let teams = dmAndTeam.teams;
    
    if (activeTab === "unread") {
      teams = teams.filter((t) => !t.lastMessageRead);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      teams = teams.filter((t) => t.name.toLowerCase().includes(term));
    }
    
    return teams;
  }, [dmAndTeam.teams, searchTerm, activeTab]);

  const filteredUsers = useMemo(() => {
    let users = dmAndTeam.friends;
    
    if (activeTab === "unread") {
      users = users.filter((u) => !u.lastMessageRead);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      users = users.filter((u) =>
        u.fullName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term)
      );
    }
    
    return users;
  }, [dmAndTeam.friends, searchTerm, activeTab]);

  // Clear remote results when search is cleared or mode changes
  useEffect(() => {
    if (!searchTerm.trim() || searchMode === "local") {
      setShowFetched({ team: false, user: false });
      setFetchedData(null);
    }
  }, [searchTerm, searchMode]);

  const clearSearch = () => {
    setSearchTerm("");
    setSearchMode("local");
  };

  // Fetch teams from API
  async function fetchTeams() {
    if (!searchTerm.trim()) return;
    
    try {
      const res = await fetch(
        `/api/teamSidebar/teamAndUser?type=team&search=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      
      setFetchedData((prev) => ({
        teams: data?.teams ?? [],
        users: prev?.users ?? [],
      }));
      setShowFetched({ team: true, user: false });
    } catch (error) {
      showToast(false, "Failed to fetch teams");
    }
  }

  // Fetch users from API
  async function fetchUsers() {
    if (!searchTerm.trim()) return;
    
    try {
      const res = await fetch(
        `/api/teamSidebar/teamAndUser?type=user&search=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      
      setFetchedData((prev) => ({
        teams: prev?.teams ?? [],
        users: data?.users ?? [],
      }));
      setShowFetched({ team: false, user: true });
    } catch (error) {
      showToast(false, "Failed to fetch users");
    }
  }

  const teamsToShow = showFetched.team ? fetchedData?.teams ?? [] : filteredTeams;
  const usersToShow = showFetched.user ? fetchedData?.users ?? [] : filteredUsers;

  // Show toggle button when sidebar is closed
  if (!isSidebarOpen) {
    return (
      <Button
        onClick={() => setIsSidebarOpen(true)}
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 h-10 w-10 rounded-lg shadow-lg hover:bg-hover"
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="w-[20%] max-md:w-[30%] bg-card border-r border-primary flex flex-col h-screen relative">
      {/* Close Button */}
      <Button
        onClick={() => setIsSidebarOpen(false)}
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8 hover:bg-hover hidden max-md:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Search Header */}
      <div className="p-3 sm:p-4 border-b border-primary space-y-3 pt-12 sm:pt-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users and teams..."
              className="pl-12 pr-9 h-10 mb-2 text-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="hover:bg-hover shrink-0">
            <Home className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Mode Toggle - Shows when there's a search term */}
        {searchTerm && (
          <div className="flex gap-2">
            <Button
              variant={searchMode === "local" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setSearchMode("local")}
            >
              Local
            </Button>
            <Button
              variant={searchMode === "global" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setSearchMode("global")}
            >
              Global
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")} className="w-full">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="all" className="flex-1 data-[state=inactive]:text-white text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 data-[state=inactive]:text-white text-xs sm:text-sm">
              Unread
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Teams Section - Fixed Height with Scroll */}
      <div className="flex-1 overflow-hidden max-h-[40vh] border-b border-primary">
        <ScrollArea className="h-full">
          <div className="pb-4">
            {teamsToShow.length > 0 ? (
              <div className="p-2">
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
                  <div key={team.id} className="relative group">
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
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedChat?.type === "team" && selectedChat.id === team.id
                          ? "bg-hover"
                          : "hover:bg-hover"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "rgba(139,92,246,0.2)" }}
                      >
                        <Users className="h-5 w-5" style={{ color: "#8b5cf6" }} />
                      </div>
                      
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-primary truncate text-sm">{team.name}</p>
                        <p className="text-xs text-secondary">
                          {team.memberCount ?? 0} members
                        </p>
                      </div>

                      {!team.lastMessageRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </button>

                    {!showFetched.team && (
                      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/projects/get/${team.projectId}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-hover">
                            <SendHorizonal className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-hover max-md:hidden"
                          onClick={() =>
                            dispatch(
                              updateChatPopUp({
                                isOpen: true,
                                selectedChat: { type: "team", id: team.id, name: team.name },
                              })
                            )
                          }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : searchTerm && searchMode === "global" ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-sm text-primary">Search for teams globally</p>
                <Button
                  onClick={fetchTeams}
                  variant="default"
                  className="hover:bg-hover"
                >
                  Search Teams
                </Button>
              </div>
            ) : searchTerm && searchMode === "local" ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No teams found locally</p>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      {/* Users Section - Takes Remaining Space with Scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="pb-4">
            {usersToShow.length > 0 ? (
              <div className="p-2">
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
                      className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-hover rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar
                          fullName={user.fullName}
                          username={user.username}
                          avatar={user.avatar}
                          getInfo={true}
                          className="w-10 h-10 shrink-0"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-primary truncate text-sm">
                            {user.fullName}
                          </span>
                          <span className="text-xs text-secondary truncate">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      
                      <Link href={`/profile/${user.username}`}>
                        <Button size="sm" variant="outline" className="shrink-0 text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <UserListItem
                      key={user.id}
                      user={user}
                      selectedChat={selectedChat}
                      setSelectedChat={setSelectedChat}
                      clearSearch={searchTerm ? clearSearch : undefined}
                    />
                  )
                )}
              </div>
            ) : searchTerm && searchMode === "global" ? (
              <div className="p-6 text-center space-y-3">
                <p className="text-sm text-primary">Search for users globally</p>
                <Button
                  onClick={fetchUsers}
                  variant="default"
                  className="hover:bg-hover"
                >
                  Search Users
                </Button>
              </div>
            ) : searchTerm && searchMode === "local" ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No users found locally</p>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;