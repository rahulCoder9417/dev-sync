
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'GENRATED';

export type ProjectQueryType =
  | 'recent'
  | 'public'
  | 'private'
  | 'genrated'
  | 'starred'
  | 'archived'
  | 'git-import';

export interface Collaborator {
  fullName: string;
  avatar?: string|null ;
  username?: string ;
  
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  lastUpdated: string;
  type: ProjectVisibility;
  isStarred: boolean;
  isGitImport: boolean;
  isArchived: boolean;
  collaborators: Collaborator[];
}
