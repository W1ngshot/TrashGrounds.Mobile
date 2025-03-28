import apiClient from './apiClient';
import { UserProfile } from '../models/userProfile';

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>(`user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    throw error;
  }
};

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>(`user/profile/my`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile', error);
    throw error;
  }
};

export const updateUserAvatar = async (newAvatarId: string): Promise<{ newAvatarId: string }> => {
  try {
    const response = await apiClient.patch<{ newAvatarId: string }>("/user/avatar", { NewAvatarId: newAvatarId });
    return response.data;
  } catch (error) {
    console.error("Failed to update avatar", error);
    throw error;
  }
};

export const updateUserStatus = async (newStatus: string): Promise<{ newStatus: string }> => {
  try {
    const response = await apiClient.patch<{ newStatus: string }>("/user/status", { NewStatus: newStatus });
    return response.data;
  } catch (error) {
    console.error("Failed to update status", error);
    throw error;
  }
};