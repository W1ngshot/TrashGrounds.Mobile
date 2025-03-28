import { TrackInfo } from './trackInfo';
import { UserInformation } from './userInformation';
import { Rate } from './rate';

export interface FullTrackInfo {
  trackInfo?: TrackInfo | null;
  userInfo?: UserInformation | null;
  rate?: Rate | null;
}
