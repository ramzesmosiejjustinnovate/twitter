import { User } from './user.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  user?: User;
  imageUrl?: string;
  likes: number;
}
