export interface Post {
  id: number;
  bodyMD: string;
  title: string;
  status: 'draft' | 'published';
  hashtags: any[];
}

export interface User {
  id: string;
  username: string;
  imageUrl: string;
}
