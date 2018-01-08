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
    }, () => {
      this.loadingError = true;
    });
  }

  getUserId(): number {
    return this.auth.getUserId();
  }

  matchingUsers(): User[] {
    if (this.name.length === 0) {
      return [];
    }

    return this.userList
      .filter(u => this.authors.map(v => v.id).indexOf(u.id) === -1)
      .filter(u => u.id !== this.getUserId())
      .filter(u => u.username.toLowerCase().startsWith(this.name.toLowerCase()));
  }

  selectUser(user: User): void {
    this.authors.push(user);
    this.name = '';
  }

  deselectUser(user: User): void {
    const index = this.authors.indexOf(user);
    if (index >= 0) {
      this.authors.splice(index, 1);
    }
  }
}
