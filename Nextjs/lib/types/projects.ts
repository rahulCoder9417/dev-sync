export type ProjectVisibility = "PUBLIC" | "PRIVATE" | "GENERATED";

export interface Collaborator {
  id: string;
  fullName: string;
  avatar?: string | null;
  email?: string;
}

export interface Project {
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
