import apiClient from './apiClient';
import { FullComment } from '../models/fullComment';

export const getTrackComments = async (trackId: string, take = 10, skip = 0): Promise<FullComment[]> => {
  try {
    const response = await apiClient.get<FullComment[]>(`/comments/track/${trackId}?take=${take}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export interface AddCommentRequest {
  Message: string;
  ReplyTo?: string | null;
}

export const addTrackComment = async (trackId: string, commentData: AddCommentRequest): Promise<void> => {
  try {
    await apiClient.post(`/comments/add/track/${trackId}`, {
      Message: commentData.Message,
      ReplyTo: commentData.ReplyTo,
    }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};