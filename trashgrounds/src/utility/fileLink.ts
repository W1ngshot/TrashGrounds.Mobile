import apiClient from '../api/apiClient';

export const getImageUrl = (imageId: string): string => {
  return `${apiClient.defaults.baseURL}/image/${imageId}`;
};

export const getTrackUrl = (trackId: string): string => {
  return `${apiClient.defaults.baseURL}/music/${trackId}`;
};