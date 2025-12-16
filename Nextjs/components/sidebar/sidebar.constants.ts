import { LucideIcon } from "lucide-react";
import { Home, FolderOpen, Users, Settings } from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  route: "dashboard" | "projects" | "team" | "settings";
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: Home, label: "Dashboard", route: "dashboard" },
  { icon: FolderOpen, label: "Projects", route: "projects" },
  { icon: Users, label: "Team", route: "team" },
  { icon: Settings, label: "Settings", route: "settings" },
];
