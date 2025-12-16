export type ProjectVisibility = "PUBLIC" | "PRIVATE" | "GENERATED";

export interface Collaborator {
  id: string;
  fullName: string;
  email: string;
}

export interface RecentProject {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  lastUpdated: string;
  type: ProjectVisibility;
  isStarred?: boolean;
  isGitImport?: boolean;
  isArchived?: boolean;
  collaborators: Collaborator[];
}
