import { User } from './user.model';

export class Comment {
  id: number;
  date: string;
  editDate: string;
  author: User;
  text: string;
}
