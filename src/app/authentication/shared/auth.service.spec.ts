import { async, inject, TestBed } from '@angular/core/testing';
import { AuthService, LoginStatus } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { AuthUser } from './auth-user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, AppConfigService]
    });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it('should load user from localStorage on creation',
    inject([HttpClient, AppConfigService], (http: HttpClient, appConfig: AppConfigService) => {
      const user = new AuthUser();
      const token = 'MyToKeN';
      user.username = 'Toto';
      user.id = 123;
      user.token = token;
      user.admin = true;

      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      const service = new AuthService(http, appConfig);

      expect(service.isLoggedIn).toEqual(true);
      expect(service.getUserId()).toEqual(123);
      expect(service.getUsername()).toEqual('Toto');
      expect(service.getToken()).toEqual(token);
      expect(service.isAdmin()).toEqual(true);

      expect(localStorage.getItem(AuthService.TOKEN_KEY)).toEqual(token);
    }));

  it('should send request on login',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {
          const user = new AuthUser();
          const token = 'MyToKeN';
          user.username = 'Toto';
          user.id = 123;
          user.token = token;
          user.admin = true;

          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.login('Toto', 'password123').subscribe(
            status => expect(status).toEqual(LoginStatus.Success));

          const req = httpMock.expectOne('https://mybackend.com/authenticate');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', password: 'password123' });
          req.flush(user);

          expect(service.isLoggedIn).toEqual(true);
          expect(service.getUserId()).toEqual(123);
          expect(service.getUsername()).toEqual('Toto');
          expect(service.getToken()).toEqual(token);
          expect(service.isAdmin()).toEqual(true);
        })));

  it('should return bad credentials status on invalid credentials',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {
          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.login('Toto', 'password123').subscribe(
            status => expect(status).toEqual(LoginStatus.BadCredentials));

          const req = httpMock.expectOne('https://mybackend.com/authenticate');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', password: 'password123' });
          req.error(new ErrorEvent('Error'), { status: 401 });
        })));

  it('should return network error status on other errors',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {
          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.login('Toto', 'password123').subscribe(
            status => expect(status).toEqual(LoginStatus.NetworkError));

          const req = httpMock.expectOne('https://mybackend.com/authenticate');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', password: 'password123' });
          req.error(new ErrorEvent('Error'));
        })));

  it('should clear localStorage on logout',
    inject([HttpClient, AppConfigService], (http: HttpClient, appConfig: AppConfigService) => {
      const user = new AuthUser();
      const token = 'MyToKeN';
      user.username = 'Toto';
      user.id = 123;
      user.token = token;
      user.admin = true;

      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      const service = new AuthService(http, appConfig);

      expect(service.isLoggedIn).toEqual(true);
      expect(service.getUserId()).toEqual(123);
      expect(service.getUsername()).toEqual('Toto');
      expect(service.getToken()).toEqual(token);
      expect(service.isAdmin()).toEqual(true);

      expect(localStorage.getItem(AuthService.TOKEN_KEY)).toEqual(token);

      service.logout();

      expect(localStorage.getItem(AuthService.USER_KEY)).toBeNull();
      expect(localStorage.getItem(AuthService.TOKEN_KEY)).toBeNull();
      expect(service.isLoggedIn).toEqual(false);
    }));
});
