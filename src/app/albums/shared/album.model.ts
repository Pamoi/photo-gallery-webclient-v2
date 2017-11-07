import { Comment } from './comment.model';
import { User } from './user.model';
import { Photo } from './photo.model';

export class Album {
  id: number;
  title: string;
  description: string;
  date: string;
  creationDate: string;
  authors: User[];
  comments: Comment[];
  photos: Photo[];
}
