
export interface User {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  }
  
  export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    collaborators?: string[];
  }
  
  export interface Tab {
    id: string;
    name: string;
    type: 'file';
    content: string;
    isActive: boolean;
    isDirty: boolean;
  }
  
  export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
  }