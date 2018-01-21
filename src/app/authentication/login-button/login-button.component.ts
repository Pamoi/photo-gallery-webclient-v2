import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent {

  constructor(private auth: AuthService) {
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  getUsername(): string {
    return this.auth.getUsername();
  }

  logout(): void {
    this.auth.logout();
  }
}
