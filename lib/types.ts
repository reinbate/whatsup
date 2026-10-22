// Shapes mirror the planned Supabase tables, so the mockup UI can be wired
// to real data later without rewriting components.

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
};

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: number;
};

export type Post = {
  id: string;
  authorId: string;
  body: string;
  photos: Photo[];
  likes: string[]; // user ids
  comments: Comment[];
  createdAt: number;
  uploading?: boolean;
};

export type AllowedEmail = {
  email: string;
  joined: boolean;
};
