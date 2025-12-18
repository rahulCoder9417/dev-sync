
export interface UpdateProfileInput {
    username: string;
    fullName: string;
    bio: string;
    avatar: File | null;
  }
  
  export interface UpdateProfileResult {
    success: boolean;
    user?: any;
    avatarUrl?: string | null;
    error?: string;
  }
  