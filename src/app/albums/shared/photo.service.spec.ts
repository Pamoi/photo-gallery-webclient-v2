import { async, inject, TestBed } from '@angular/core/testing';

import { PhotoService } from './photo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { Photo } from './photo.model';

describe('PhotoService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoService, AppConfigService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  describe('getPhoto()', () => {
    it('should send request to backend and return blob',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const blob = new Blob(['data']);
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getPhoto(photo).subscribe(b => expect(b).toEqual(blob));

            const req = httpMock.expectOne('https://mybackend.com/photo/666');
            expect(req.request.method).toEqual('GET');
            req.flush(blob);
          })));

    it('should not resolve observable on failed request',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getPhoto(photo).subscribe(b => fail('Failed request should not return'));

            const req = httpMock.expectOne('https://mybackend.com/photo/666');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getCoverPhoto()', () => {
    it('should send request to backend and return blob',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const blob = new Blob(['data']);
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getCoverPhoto(photo).subscribe(b => expect(b).toEqual(blob));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/cover');
            expect(req.request.method).toEqual('GET');
            req.flush(blob);
          })));

    it('should not resolve observable on failed request',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getCoverPhoto(photo).subscribe(b => fail('Failed request should not return'));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/cover');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getResizedPhoto()', () => {
    it('should send request to backend and return blob',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const blob = new Blob(['data']);
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getResizedPhoto(photo).subscribe(b => expect(b).toEqual(blob));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/resized');
            expect(req.request.method).toEqual('GET');
            req.flush(blob);
          })));

    it('should not resolve observable on failed request',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getResizedPhoto(photo).subscribe(b => fail('Failed request should not return'));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/resized');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getThumbnailPhoto()', () => {
    it('should send request to backend and return blob',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const blob = new Blob(['data']);
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getThumbnailPhoto(photo).subscribe(b => expect(b).toEqual(blob));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/thumb');
            expect(req.request.method).toEqual('GET');
            req.flush(blob);
          })));

    it('should not resolve observable on failed request',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            const photo = new Photo();
            photo.id = 666;

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getThumbnailPhoto(photo).subscribe(b => fail('Failed request should not return'));

            const req = httpMock.expectOne('https://mybackend.com/photo/666/thumb');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('deletePhoto()', () => {
    it('should send request to backend and return void',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deletePhoto(666).subscribe();

            const req = httpMock.expectOne('https://mybackend.com/photo/666');
            expect(req.request.method).toEqual('DELETE');
            req.flush(null);
          })));

    it('should throw on error',
      async(
        inject([HttpTestingController, AppConfigService, PhotoService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: PhotoService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deletePhoto(666).subscribe(() => fail('Failed request should not succeed'),
              (e) => expect(e.message).toEqual('Error while deleting photo.'));

            const req = httpMock.expectOne('https://mybackend.com/photo/666');
            expect(req.request.method).toEqual('DELETE');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getPhotoUploader()', () => {
    it('should return configured uploader', inject([AppConfigService, PhotoService],
      (appConfig: AppConfigService, service: PhotoService) => {
        spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

        const uploader = service.getPhotoUploader();

        expect(uploader.url).toEqual('https://mybackend.com/photo');
        expect(uploader.requestFilename).toEqual('photo');
      }));
  });
});
