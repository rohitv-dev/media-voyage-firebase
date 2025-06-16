export interface Notification {
  id: string;
  title: string;
  description: string;
  for: string;
  hasRead: boolean;
  createdAt: Date;
}
