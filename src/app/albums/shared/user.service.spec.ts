import { async, inject, TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { User } from './user.model';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, AppConfigService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  describe('getUsers()', () => {
    it('should send request and return users',
      async(inject([UserService, HttpTestingController, AppConfigService],
        (service: UserService, httpMock: HttpTestingController, appConfig: AppConfigService) => {
          const testUsers = [new User(), new User(), new User()];
          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.getUsers().subscribe(users => expect(users).toEqual(testUsers));

          const req = httpMock.expectOne('https://mybackend.com/user/list');
          expect(req.request.method).toEqual('GET');
          req.flush(testUsers);
        })));

    it('should throw on error',
      async(inject([UserService, HttpTestingController, AppConfigService],
        (service: UserService, httpMock: HttpTestingController, appConfig: AppConfigService) => {
          spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

          service.getUsers().subscribe(
            () => fail(),
            e => expect(e.message).toEqual('Error while fetching users.')
            );

          const req = httpMock.expectOne('https://mybackend.com/user/list');
          expect(req.request.method).toEqual('GET');
          req.error(new ErrorEvent('TestError'));
        })));
  });
});
