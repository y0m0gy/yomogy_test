import { ParsedUrlQuery } from "querystring";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface PostData {
  id: string;
  [key: string]: any;
}

export interface Category extends ParsedUrlQuery {
  category: string;
}

export interface PostID extends ParsedUrlQuery {
  id: string;
}

export interface Tag extends ParsedUrlQuery {
  tag: string;
}

export interface Post {
  id: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  author: string;
  description: string;
  tag: [];
  coverImage: string;
  rePost: string;
}

export interface PostLists {
  title: string;
  posts: Post[];
}

export interface ListCount {
  categories: Record<string, number>;
  authors: Record<string, number>;
  categoryTags: Record<string, Record<string, number>>;
}

// Define the type for props
export interface PageNationProps {
  posts: Post[];
  title: string;
  page: number;
  totalPages: number;
}

export interface SidebarProps {
  title: string;
  relatedPosts: Post[];
}

export interface AdjacentPosts {
  beforeAdjacentPost: { id: string; title: string; category: string } | null;
  afterAdjacentPost: { id: string; title: string; category: string } | null;
}

export interface BlogPostProps {
  category: string;
  id: string;
  content: MDXRemoteSerializeResult;
  data: Post;
  relatedPosts: Post[];
  author: AuthorData;
  adjacentPosts: AdjacentPosts;
}

export interface BlogPostOnlyProps {
  content: MDXRemoteSerializeResult;
  data: Post;
  author: AuthorData;
  id: string;
  adjacentPosts: AdjacentPosts;
}

export interface AuthorData {
  name: string;
  description: string;
  twitter: string;
  image: string;
}
