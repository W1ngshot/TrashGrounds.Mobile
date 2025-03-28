import { Genre } from './genre';

export interface MusicTrack {
  id: string;
  title: string;
  description?: string | null;
  isExplicit: boolean;
  uploadDate: string;
  listensCount: number;
  pictureId?: string | null;
  musicId: string;
  userId: string;
  genres: Genre[];
}