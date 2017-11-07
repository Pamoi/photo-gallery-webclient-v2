import { Comment } from './comment.model';
import { User } from './user.model';

export class Photo {
  id: number;
  date: string;
  uploadDate: string;
  author: User;
  comments: Comment[];
}
