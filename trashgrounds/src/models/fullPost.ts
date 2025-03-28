import { Post } from "./post";

export interface FullPost {
  post: Post;
  rate: number | null;
}