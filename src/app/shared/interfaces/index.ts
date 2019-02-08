export interface Post {
    id: number;
    bodyMD: string;
    title: string;
    status: 'draft' | 'published';
  }
