export interface Post {
  id: number;
  body: string;
  bodyMD: string;
  title: string;
  status: 'draft' | 'published';
  userPostHashtags: any[];
  hashtags: string; // for setting up the hashtags,
  userId: number;
  parentPostId: number;
  parentPost: Post;
}

export interface User {
  id: number;
  username: string;
  imageUrl: string;
}
