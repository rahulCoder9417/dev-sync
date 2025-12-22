
  
  export interface Tab {
    id: string;
    name: string;
    type: 'file';
    content: string;
    isActive: boolean;
    isDirty: boolean;
  }
  