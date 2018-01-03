import { Component, OnInit } from '@angular/core';
import { AuthService, LoginStatus } from '../shared/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  MIN_PASSWORD_LENGTH = 8;
  LS = LoginStatus;

  oldPass: string;
  newPass: string;
  confirmPass: string;
  status: LoginStatus = null;
  passwordForm: FormGroup;

  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
    const oldPassFormControl = new FormControl(this.oldPass, [
      Validators.required,
      Validators.minLength(1),
    ]);

    const newPassFormControl = new FormControl(this.newPass, [
      Validators.required,
      Validators.minLength(this.MIN_PASSWORD_LENGTH),
    ]);

    const confirmPassFormControl = new FormControl(this.confirmPass);

    this.passwordForm = new FormGroup({
      'oldPass': oldPassFormControl,
      'newPass': newPassFormControl,
      'confirmPass': confirmPassFormControl
    });
  }

  get old() {
    return this.passwordForm.get('oldPass');
  }

  get new() {
    return this.passwordForm.get('newPass');
  }

  get confirm() {
    return this.passwordForm.get('confirmPass');
  }

  onSubmit(): void {
    if (this.passwordForm.valid && this.new.value === this.confirm.value && this.isLoggedIn()) {
      this.status = null;
      this.auth.setPassword(this.auth.getUsername(), this.old.value, this.new.value).subscribe(status => {
        this.status = status;
      });
    }
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }
}
