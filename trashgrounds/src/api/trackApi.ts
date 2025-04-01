import { FullTrack } from "../models/fullTrack";
import { FullTrackInfo } from "../models/fullTrackInfo";
import { Genre } from "../models/genre";
import { AddTrackRequest } from "../models/requests/addTrackRequest";
import apiClient from "./apiClient";

export const getTrackListByCategory = async (
  category: string,
  take: number,
  skip: number
): Promise<FullTrackInfo[]> => {
  try {
    const response = await apiClient.get<FullTrackInfo[]>(`/track/${category}?take=${take}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tracks for category ${category}:`, error);
    throw error;
  }
};

export const getTrackDetails = async (trackId: string): Promise<FullTrack> => {
  try {
    const response = await apiClient.get<FullTrack>(`/track/${trackId}`);

    return response.data;
  } catch (error) {
    console.error('Error fetching track details:', error);
    throw error;
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await apiClient.get<{ genres: Genre[] }>('/genres/all');

    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const addTrack = async (trackData: AddTrackRequest): Promise<FullTrack> => {
  try {
    const response = await apiClient.post<FullTrack>('/track/add', trackData);

    return response.data;
  } catch (error) {
    console.error('Error adding track:', error);
    throw error;
  }
};


export const getTrackListFromUser = async (
  userId: string,
  excludeTrackId: string | null,
  take: number,
  skip: number
): Promise<FullTrackInfo[]> => {
  try {
    const params = new URLSearchParams({
      take: take.toString(),
      skip: skip.toString(),
    });

    if (excludeTrackId && excludeTrackId.length > 0) {
      params.append('excludeTrackId', excludeTrackId);
    }

    const response = await apiClient.get<FullTrackInfo[]>(`/track/from-user/${userId}?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error(`Error fetching tracks from user ${userId}:`, error);
    throw error;
  }
};