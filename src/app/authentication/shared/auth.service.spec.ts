import { async, inject, TestBed } from '@angular/core/testing';
import { AuthService, LoginStatus } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { AuthUser } from './auth-user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';
import { CoreModule } from '../../core/core.module';

const routerStub = {
  navigateByUrl() {
  }
};

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [AuthService, AppConfigService, ToastService, {
        provide: Router,
        useValue: routerStub
      }]
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
    inject([HttpClient, AppConfigService, Router, ToastService],
      (http: HttpClient, appConfig: AppConfigService, router: Router, toast: ToastService) => {
        const user = new AuthUser();
        const token = 'header.e30.signature';
        user.username = 'Toto';
        user.id = 123;
        user.token = token;
        user.admin = true;

        localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

        const service = new AuthService(http, appConfig, router, toast);

        expect(service.isLoggedIn).toEqual(true);
        expect(service.getUserId()).toEqual(123);
        expect(service.getUsername()).toEqual('Toto');
        expect(service.getToken()).toEqual(token);
        expect(service.isAdmin()).toEqual(true);

        expect(localStorage.getItem(AuthService.TOKEN_KEY)).toEqual(token);
    }));

  it('should not load user on creation if token has expired',
    inject([HttpClient, AppConfigService, Router, ToastService],
      (http: HttpClient, appConfig: AppConfigService, router: Router, toast: ToastService) => {
        const user = new AuthUser();
        const token = 'header.eyJleHAiOjF9.signature';
        user.username = 'Toto';
        user.id = 123;
        user.token = token;
        user.admin = true;

        localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

        const service = new AuthService(http, appConfig, router, toast);

        expect(service.isLoggedIn).toEqual(false);
        expect(localStorage.getItem(AuthService.TOKEN_KEY)).toBeNull();
        expect(localStorage.getItem(AuthService.USER_KEY)).toBeNull();
      }));

  it('should send request on login',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {
          const user = new AuthUser();
          const token = 'header.e30.signature';
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

  it('should return bad credentials status on login with invalid credentials',
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

  it('should return network error status on login with other errors',
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

  it('should send request on set password',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {

          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.setPassword('Toto', 'password123', '12341234').subscribe(
            status => expect(status).toEqual(LoginStatus.Success));

          const req = httpMock.expectOne('https://mybackend.com/password');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', oldPass: 'password123', newPass: '12341234' });
        })));

  it('should send return bad credentials status on set password with wrong old password',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {

          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.setPassword('Toto', 'password123', '12341234').subscribe(
            status => expect(status).toEqual(LoginStatus.BadCredentials));

          const req = httpMock.expectOne('https://mybackend.com/password');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', oldPass: 'password123', newPass: '12341234' });
          req.error(new ErrorEvent('Error'), { status: 401 });
        })));

  it('should send return network error status on set password error',
    async(
      inject([AuthService, AppConfigService, HttpTestingController],
        (service: AuthService, appConfig: AppConfigService, httpMock: HttpTestingController) => {

          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.setPassword('Toto', 'password123', '12341234').subscribe(
            status => expect(status).toEqual(LoginStatus.NetworkError));

          const req = httpMock.expectOne('https://mybackend.com/password');
          expect(req.request.method).toEqual('POST');
          expect(req.request.body).toEqual({ username: 'Toto', oldPass: 'password123', newPass: '12341234' });
          req.error(new ErrorEvent('Error'));
        })));

  it('should clear localStorage, show toast and redirect on logout',
    inject([HttpClient, AppConfigService, Router, ToastService],
      (http: HttpClient, appConfig: AppConfigService, router: Router, toast: ToastService) => {
      const user = new AuthUser();
      const token = 'header.e30.signature';
      user.username = 'Toto';
      user.id = 123;
      user.token = token;
      user.admin = true;

      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));

      const routerSpy = spyOn(router, 'navigateByUrl');
      const toastSpy = spyOn(toast, 'toast');

      const service = new AuthService(http, appConfig, router, toast);

      service.logout();

      expect(localStorage.getItem(AuthService.USER_KEY)).toBeNull();
      expect(localStorage.getItem(AuthService.TOKEN_KEY)).toBeNull();
      expect(service.isLoggedIn).toEqual(false);
      expect(toastSpy).toHaveBeenCalledWith('Vous avez été déconnecté.', ToastType.Info, ToastDuration.Medium);
      expect(routerSpy).toHaveBeenCalledWith('/');
    }));
});
