import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private static HEADER_NAME = 'X-AUTH-TOKEN';

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem(AuthService.TOKEN_KEY);

    if (authToken) {
      const authReq = req.clone({headers: req.headers.set(AuthInterceptor.HEADER_NAME, authToken)});
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
