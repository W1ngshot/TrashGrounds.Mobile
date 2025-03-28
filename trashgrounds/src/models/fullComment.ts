import { Comment } from "./comment";
import { UserInformation } from "./userInformation";

export interface FullComment {
  comment: Comment | null;
  userInfo: UserInformation | null;
}