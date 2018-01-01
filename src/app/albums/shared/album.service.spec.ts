import { async, inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { AlbumService } from './album.service';
import { Album } from './album.model';
import { Comment } from './comment.model';
import { of } from 'rxjs/observable/of';

describe('AlbumService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlbumService, AppConfigService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  describe('getAlbums()', () => {
    it('should send request to backend and return list',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const testAlbumList: Album[] = [
              {
                id: 1,
                title: 'Album 1',
                description: 'A brief description',
                photos: [],
                comments: [],
                authors: [],
                creationDate: '',
                date: ''
              }
            ];

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbums(3).subscribe(albums => expect(albums).toEqual(testAlbumList));

            const req = httpMock.expectOne('https://mybackend.com/album/list/3');
            expect(req.request.method).toEqual('GET');
            req.flush(testAlbumList);
          })));

    it('should throw on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbums(1).subscribe(
              albums => fail(),
              (e) => expect(e.message).toEqual('An error occurred while fetching album list.'));

            const req = httpMock.expectOne('https://mybackend.com/album/list/1');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const testAlbum: Album = {
              id: 1,
              title: 'Album 1',
              description: 'A brief description',
              photos: [],
              comments: [],
              authors: [],
              creationDate: '',
              date: ''
            };

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbum(1).subscribe(album => expect(album).toEqual(testAlbum));

            const req = httpMock.expectOne('https://mybackend.com/album/1');
            expect(req.request.method).toEqual('GET');
            req.flush(testAlbum);
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbum(1).subscribe(album => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while fetching album.'));

            const req = httpMock.expectOne('https://mybackend.com/album/1');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('commentAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const testAlbum: Album = {
              id: 1,
              title: 'Album 1',
              description: 'A brief description',
              photos: [],
              comments: [],
              authors: [],
              creationDate: '',
              date: ''
            };

            const text = 'My comment text';

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.commentAlbum(1, text).subscribe(album => expect(album).toEqual(testAlbum));

            const req = httpMock.expectOne('https://mybackend.com/album/1/comment');
            expect(req.request.method).toEqual('POST');
            expect(req.request.body.text).toEqual(text);
            req.flush(testAlbum);
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            const text = 'My comment text';

            service.commentAlbum(1, text).subscribe(album => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while sending comment.'));

            const req = httpMock.expectOne('https://mybackend.com/album/1/comment');
            expect(req.request.method).toEqual('POST');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('deleteComment()', () => {
    it('should send request to backend and return void',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deleteComment(1, 11).subscribe();

            const req = httpMock.expectOne('https://mybackend.com/album/1/comment/11');
            expect(req.request.method).toEqual('DELETE');
            req.flush(of(null));
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deleteComment(1, 11).subscribe(() => fail(),
              error => expect(error.message).toEqual('An error occurred while deleting comment.'));

            const req = httpMock.expectOne('https://mybackend.com/album/1/comment/11');
            expect(req.request.method).toEqual('DELETE');
            req.error(new ErrorEvent('Test Error'));
          })));
  });
});
