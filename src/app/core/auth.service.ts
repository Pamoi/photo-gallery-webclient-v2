import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable()
export class AuthService {
  private static USER_KEY = 'photo-gallery-webclient-v2.user';

  /* To avoid dependency cycle AuthInterceptor cannot depend on AuthService as it depends on HttpClient
   * (which in turn depends on all interceptors). As a workaround AuthInterceptor directly reads the token
   * from the localStorage.
   * This has to be taken in consideration if replacing the localStorage based implementation. */
  public static TOKEN_KEY = 'photo-gallery-webclient-v2.token';

  private user: AuthUser;
  private isLoggedIn: boolean;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    const userString = localStorage.getItem(AuthService.USER_KEY);

    try {
      const userObject = JSON.parse(userString);

      this.user = new AuthUser();
      this.user.username = userObject.name;
      this.user.id = userObject.id;
      this.user.admin = userObject.admin;

      localStorage.setItem(AuthService.TOKEN_KEY, this.user.token);

      this.isLoggedIn = true;
    } catch (e) {
      this.isLoggedIn = false;
    }
  }

  login(username: string, password: string): void {
    this.http.post<AuthUser>(this.appConfig.getBackendUrl() + '/authenticate', {
      'username': username,
      'password': password
    }).subscribe(user => {
      this.user = user;
      localStorage.setItem(AuthService.TOKEN_KEY, this.user.token);
      this.isLoggedIn = true;
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(this.user));
    });
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
