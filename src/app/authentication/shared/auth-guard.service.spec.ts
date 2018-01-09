import { inject, TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

const authServiceStub = {
  isLoggedIn: false,
  redirectUrl: undefined
};

const routerStub = {
  navigateByUrl(url: string) {
  }
};

describe('AuthGuard', () => {
  let activatedRouteStub: any;
  let routerStateStub: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: authServiceStub
        },
        {
          provide: Router,
          useValue: routerStub
        }
      ]
    });
  });

  beforeEach(() => {
    activatedRouteStub = {};
    routerStateStub = { url: '/admin/private' };
  });

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy();
  }));

  it('canActivate() should return true when user is logged in',
    inject([AuthGuard, AuthService], (service: AuthGuard, auth: AuthService) => {
    auth.isLoggedIn = true;

    expect(service.canActivate(activatedRouteStub, routerStateStub)).toEqual(true);
  }));

  it('canActivate() should redirect to login route and set redirectUrl if the user is not logged in',
    inject([AuthGuard, AuthService, Router], (service: AuthGuard, auth: AuthService, router: Router) => {
      auth.isLoggedIn = false;
      const spy = spyOn(router, 'navigateByUrl');

      expect(service.canActivate(activatedRouteStub, routerStateStub)).toEqual(false);
      expect(spy).toHaveBeenCalledWith('/login');
      expect(auth.redirectUrl).toEqual('/admin/private');
    }));
});
