import { PostsUserRate } from "../models/postsUserRate";
import { TrackUserRate } from "../models/trackUserRate";
import apiClient from "./apiClient";

export const getUserTrackRate = async (trackId: string): Promise<TrackUserRate> => {
  try {
    const response = await apiClient.get<TrackUserRate>(`/rate/track/${trackId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user track rate for track ${trackId}:`, error);
    throw error;
  }
};

export const rateTrack = async (trackId: string, newRate: number): Promise<void> => {
  try {
    await apiClient.post(`/rate/track/${trackId}`, {
      newRate: newRate
    });
  } catch (error) {
    console.error(`Error rating track ${trackId}:`, error);
    throw error;
  }
};

export const getPostsUserRate = async (postIds: string[]): Promise<PostsUserRate> => {
  try {
    const params = new URLSearchParams();
    postIds.forEach((id) => params.append('PostsId', id));

    const response = await apiClient.get<PostsUserRate>('/rate/from-posts', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching post ratings:', error);
    throw error;
  }
};

export const ratePost = async (postId: string, rate: number): Promise<void> => {
  try {
    await apiClient.post(`/rate/post/${postId}`, { newRate: rate });
  } catch (error) {
    console.error('Error rating post:', error);
    throw error;
  }
};

export const deleteRatePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.delete(`/rate/post/${postId}`);
  } catch (error) {
    console.error('Error deleting rating for post:', error);
    throw error;
  }
};