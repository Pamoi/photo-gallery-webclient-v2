import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

import 'rxjs/add/operator/do';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private static HEADER_NAME = 'X-AUTH-TOKEN';

  private auth: AuthService;

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.injector.get(AuthService);
    const authToken = this.auth.getToken();

    if (authToken) {
      const authReq = req.clone({headers: req.headers.set(AuthInterceptor.HEADER_NAME, authToken)});

      return next.handle(authReq).do(
        () => {},
        event => {
          if (event instanceof HttpErrorResponse) {
            if (event.status === 403) {
              this.auth.logout();
            }
          }
        });
    }

    return next.handle(req);
  }
}
