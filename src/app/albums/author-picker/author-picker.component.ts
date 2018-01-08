import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';
import { AuthService } from '../../authentication/shared/auth.service';

@Component({
  selector: 'app-author-picker',
  templateUrl: './author-picker.component.html',
  styleUrls: ['./author-picker.component.scss']
})
export class AuthorPickerComponent implements OnInit {
  @Input() authors: User[];

  name = '';
  userList: User[] = [];
  loadingError: boolean;

  constructor(private userService: UserService, private auth: AuthService) {
  }

  ngOnInit() {
    this.getUserList();
  }

  getUserList(): void {
    this.loadingError = false;

    this.userService.getUsers().subscribe(users => {
      this.userList = users;
      // Remove users which already are authors as well as current user from the list of possible co-authors.
      this.authors.forEach(u => {
        this.userList = this.userList.filter(u2 => u2.id !== u.id);
      });
      this.userList = this.userList.filter(u => u.id !== this.auth.getUserId());
    }, () => {
      this.loadingError = true;
    });
  }

  matchingUsers(): User[] {
    if (this.name.length === 0) {
      return [];
    }

    return this.userList.filter(u => u.username.toLowerCase().startsWith(this.name.toLowerCase()));
  }

  selectUser(user: User): void {
    const index = this.userList.indexOf(user);
    if (index >= 0) {
      this.userList.splice(index, 1);
      this.authors.push(user);
      this.name = '';
    }
  }

  deselectUser(user: User): void {
    const index = this.authors.indexOf(user);
    if (index >= 0) {
      this.authors.splice(index, 1);
      this.userList.push(user);
    }
  }
}
