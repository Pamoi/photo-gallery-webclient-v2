import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './shared/auth-guard.service';
import { LoginButtonComponent } from './login-button/login-button.component';
import { CoreModule } from '../core/core.module';


@NgModule({
  imports: [
    AuthenticationRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  declarations: [LoginComponent, AccountComponent, LoginButtonComponent],
  exports: [LoginButtonComponent]
})
export class AuthenticationModule {}
