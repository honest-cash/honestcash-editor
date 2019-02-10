export interface Post {
  id: number;
  bodyMD: string;
  title: string;
  status: 'draft' | 'published';
  userPostHashtags: any[];
  hashtags: any[]; // for setting up the hashtags
}

export interface User {
  id: string;
  username: string;
  imageUrl: string;
}
