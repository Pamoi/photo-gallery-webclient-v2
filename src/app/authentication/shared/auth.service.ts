import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from '../../core/shared/app-config.service';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthService {
  private static USER_KEY = 'photo-gallery-webclient-v2.user';

  /* To avoid dependency cycle AuthInterceptor cannot depend on AuthService as it depends on HttpClient
   * (which in turn depends on all interceptors). As a workaround AuthInterceptor directly reads the token
   * from the localStorage.
   * This has to be taken in consideration if replacing the localStorage based implementation. */
  public static TOKEN_KEY = 'photo-gallery-webclient-v2.token';

  private user: AuthUser;
  public isLoggedIn: boolean;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    const userString = localStorage.getItem(AuthService.USER_KEY);

    try {
      const userObject = JSON.parse(userString);

      this.user = new AuthUser();
      this.user.username = userObject.username;
      this.user.id = userObject.id;
      this.user.admin = userObject.admin;

      localStorage.setItem(AuthService.TOKEN_KEY, this.user.token);

      this.isLoggedIn = true;
    } catch (e) {
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
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(LoginStatus.BadCredentials);
        }
        return of(LoginStatus.NetworkError);
      }
    ));
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user = null;
    localStorage.setItem(AuthService.USER_KEY, null);
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
}

export enum LoginStatus {
  Success,
  NetworkError,
  BadCredentials
}
