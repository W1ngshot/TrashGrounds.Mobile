import { FullPost } from "../models/fullPost";
import { Post } from "../models/post";
import { AddPostRequest } from "../models/requests/addPostRequest";
import apiClient from "./apiClient";

export const getPostListFromUser = async (
  userId: string,
  take: number,
  skip: number
): Promise<FullPost[]> => {
  try {
    const response = await apiClient.get<FullPost[]>(`/posts/from-user/${userId}?take=${take}&skip=${skip}`);

    return response.data;
  } catch (error) {
    console.error(`Error fetching posts from user ${userId}:`, error);
    throw error;
  }
};

export const addPost = async (postData: AddPostRequest): Promise<Post> => {
  try {
    const response = await apiClient.post<Post>('/posts/add', postData);

    return response.data;
  } catch (error) {
    console.error('Error adding track:', error);
    throw error;
  }
};