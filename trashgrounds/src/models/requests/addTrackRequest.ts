export interface AddTrackRequest {
  Title: string;
  Description: string | null;
  IsExplicit: boolean;
  PictureId: string | null;
  MusicId: string;
  Genres: string[];
}