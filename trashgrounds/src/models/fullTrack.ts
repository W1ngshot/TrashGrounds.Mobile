import { UserInformation } from './userInformation';
import { Rate } from './rate';
import { MusicTrack } from './musicTrack';

export interface FullTrack {
  track?: MusicTrack | null;
  userInfo?: UserInformation | null;
  rate?: Rate | null;
}