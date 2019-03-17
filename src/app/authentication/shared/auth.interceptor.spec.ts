import { AuthService } from './auth.service';
import { AppConfigService } from '../../core/shared/app-config.service';
import { inject, TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { never } from 'rxjs/observable/never';


const appConfigStub = {
  getBackendUrl() {
    return 'https://mybackend.com';
  }
};

const authServiceStub = {
  getToken() {
    return '1234isNotASecureToken';
  }
};

const nextHandler = {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return Observable.never()
  }
};

describe('AuthInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AppConfigService, useValue: appConfigStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    });
  });

  it('should set token header on API requests', inject([AuthInterceptor],
    (interceptor: AuthInterceptor) => {
      const req = new HttpRequest('GET', 'https://mybackend.com/album/1');
      const spy = spyOn(nextHandler, 'handle').and.callFake((r: HttpRequest<any>) => {
        expect(r.headers.get('X-AUTH-TOKEN')).toEqual('1234isNotASecureToken');
        return never();
      });

      interceptor.intercept(req, nextHandler);

      expect(spy).toHaveBeenCalled();
  }));

  it('should not set token header on other requests', inject([AuthInterceptor],
    (interceptor: AuthInterceptor) => {
      const req = new HttpRequest('GET', 'https://somedomain.com/some/route');
      const spy = spyOn(nextHandler, 'handle').and.callFake((r: HttpRequest<any>) => {
        expect(r.headers.get('X-AUTH-TOKEN')).toBeNull();
        return never();
      });

      interceptor.intercept(req, nextHandler);

      expect(spy).toHaveBeenCalled();
    }));
});
