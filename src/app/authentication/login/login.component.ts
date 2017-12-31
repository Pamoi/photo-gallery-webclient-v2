import { Component } from '@angular/core';
import { AuthService, LoginStatus } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string;
  password: string;
  status: LoginStatus = LoginStatus.Success;

  // Expose enum to template
  LS = LoginStatus;

  constructor(private auth: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.status = LoginStatus.Success;

    this.auth.login(this.username, this.password).subscribe(status => {
      this.status = status;

      if (this.status === LoginStatus.Success) {
        this.router.navigateByUrl('/');
      }
    });
  }
}
