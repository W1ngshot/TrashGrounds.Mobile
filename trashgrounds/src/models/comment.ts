export interface Comment {
  id: string;
  message: string;
  sendAt: string;
  editedAt?: string | null;
  replyTo?: string | null;
  userId: string;
  trackId: string;
}