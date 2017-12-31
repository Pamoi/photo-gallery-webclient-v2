import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/auth.service';
import { AuthInterceptor } from './shared/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    AuthenticationRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  declarations: [LoginComponent]
})
export class AuthenticationModule {}
