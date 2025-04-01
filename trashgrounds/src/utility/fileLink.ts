import apiClient from '../api/apiClient';

export const getImageUrl = (imageId: string): string => {
  return `${apiClient.defaults.baseURL}/image/${imageId}`;
};

export const getTrackUrl = (trackId: string): string => {
  return `${apiClient.defaults.baseURL}/music/${trackId}`;
};

export const getDefaultImageUrl = (): string => {
  return 'https://placehold.co/300x300/black/white?text=No%0AImage%0AHere';
};