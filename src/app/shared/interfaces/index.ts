export interface Post {
  id: number;
  bodyMD: string;
  title: string;
  status: 'draft' | 'published';
  userPostHashtags: any[];
  hashtags: string; // for setting up the hashtags,
  userId: number;
}

export interface User {
  id: number;
  username: string;
  imageUrl: string;
}
