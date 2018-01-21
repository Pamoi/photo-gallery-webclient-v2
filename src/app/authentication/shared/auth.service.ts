import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from '../../core/shared/app-config.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';

@Injectable()
export class AuthService {
  public static USER_KEY = 'photo-gallery-webclient-v2.user';

  /* To avoid dependency cycle AuthInterceptor cannot depend on AuthService as it depends on HttpClient
   * (which in turn depends on all interceptors). As a workaround AuthInterceptor directly reads the token
   * from the localStorage.
   * This has to be taken in consideration if replacing the localStorage based implementation. */
  public static TOKEN_KEY = 'photo-gallery-webclient-v2.token';

  public isLoggedIn: boolean;
  public redirectUrl: string;

  private user: AuthUser;

  constructor(private http: HttpClient, private appConfig: AppConfigService, private router: Router,
              private toast: ToastService) {
    const userString = localStorage.getItem(AuthService.USER_KEY);

    try {
      const userObject = JSON.parse(userString);

      this.user = new AuthUser();
      this.user.username = userObject.username;
      this.user.id = userObject.id;
      this.user.admin = userObject.admin;
      this.user.token = userObject.token;
      this.verifyToken(this.user.token);

      localStorage.setItem(AuthService.TOKEN_KEY, this.user.token);

      this.isLoggedIn = true;
    } catch (e) {
      localStorage.removeItem(AuthService.USER_KEY);
      localStorage.removeItem(AuthService.TOKEN_KEY);
      this.isLoggedIn = false;
    }
  }

  login(username: string, password: string): Observable<LoginStatus> {
    return this.http.post<AuthUser>(this.appConfig.getBackendUrl() + '/authenticate', {
      'username': username,
      'password': password
    }).map(user => {
      this.user = user;
      localStorage.setItem(AuthService.TOKEN_KEY, this.user.token);
      this.isLoggedIn = true;
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(this.user));

      return LoginStatus.Success;
    }).pipe(catchError(
      this.handleAuthError()
    ));
  }

  setPassword(username: string, oldPassword: string, newPassword: string): Observable<LoginStatus> {
    return this.http.post<void>(this.appConfig.getBackendUrl() + '/password', {
      username: username,
      oldPass: oldPassword,
      newPass: newPassword
    }).map(() => LoginStatus.Success).pipe(catchError(
      this.handleAuthError()
    ));
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user = null;
    localStorage.removeItem(AuthService.USER_KEY);
    localStorage.removeItem(AuthService.TOKEN_KEY);

    this.toast.toast('Vous avez été déconnecté.', ToastType.Info, ToastDuration.Medium);
    this.router.navigateByUrl('/');
  }

  getUserId(): number {
    if (this.isLoggedIn) {
      return this.user.id;
    }

    return undefined;
  }

  getUsername(): string {
    if (this.isLoggedIn) {
      return this.user.username;
    }

    return '';
  }

  isAdmin(): boolean {
    if (this.isLoggedIn) {
      return this.user.admin;
    }

    return false;
  }

  getToken(): string {
    if (this.isLoggedIn) {
      return this.user.token;
    }

    return '';
  }

  private handleAuthError(): (HttpErrorResponse) => Observable<LoginStatus> {
    return (error: HttpErrorResponse) => {
      if (error.status === 401) {
        return of(LoginStatus.BadCredentials);
      }
      return of(LoginStatus.NetworkError);
    };
  }

  private verifyToken(token: string): void {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Wrong number of parts in token');
    }

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp) {
      const now = new Date().getTime() / 1000;

      if (now > payload.exp) {
        throw new Error('Token has expired');
      }
    }
  }
}

export enum LoginStatus {
  Success,
  NetworkError,
  BadCredentials
}
