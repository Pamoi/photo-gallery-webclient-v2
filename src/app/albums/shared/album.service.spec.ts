import { async, inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '../../core/shared/app-config.service';
import { AlbumService } from './album.service';
import { Album } from './album.model';
import { of } from 'rxjs/observable/of';

describe('AlbumService', () => {

  const testAlbum = new Album();
  testAlbum.id = 1;
  testAlbum.title = 'Album 1';
  testAlbum.description = 'A brief description';
  testAlbum.photos = [];
  testAlbum.comments = [];
  testAlbum.authors = [{ id: 1, username: 'Toto' }, { id: 12, username: 'Titi' }];
  testAlbum.creationDate = '';
  testAlbum.date = '';
  testAlbum.dateObject = new Date();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlbumService, AppConfigService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  describe('getAlbumsBefore()', () => {
    it('should send request to backend and return list',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const testAlbumList: Album[] = [testAlbum];

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumsBefore('2018-01-17T21:12:45.000Z')
              .subscribe(albums => expect(albums).toEqual(testAlbumList));

            const req = httpMock.expectOne('https://mybackend.com/album/list?before=2018-01-17T21:12:45.000Z');
            expect(req.request.method).toEqual('GET');
            req.flush(testAlbumList);
          })));

    it('should throw on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumsBefore('2018-01-17T21:12:45.000Z').subscribe(
              albums => fail(),
              (e) => expect(e.message).toEqual('An error occurred while fetching albums.'));

            const req = httpMock.expectOne('https://mybackend.com/album/list?before=2018-01-17T21:12:45.000Z');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));

    it('should throw AlbumError with endReached set to true on 404',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumsBefore('2018-01-17T21:12:45.000Z').subscribe(
              albums => fail(),
              (e) => expect(e.endReached).toEqual(true));

            const req = httpMock.expectOne('https://mybackend.com/album/list?before=2018-01-17T21:12:45.000Z');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'), { status: 404 });
          })));
  });

  describe('getAlbumsBefore()', () => {
    it('should send request to backend and return list',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const testAlbumList: Album[] = [testAlbum];

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumsAfter('2018-01-17T21:12:45.000Z')
              .subscribe(albums => expect(albums).toEqual(testAlbumList));

            const req = httpMock.expectOne('https://mybackend.com/album/list?after=2018-01-17T21:12:45.000Z');
            expect(req.request.method).toEqual('GET');
            req.flush(testAlbumList);
          })));

    it('should throw on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumsAfter('2018-01-17T21:12:45.000Z').subscribe(
              albums => fail(),
              (e) => expect(e.message).toEqual('An error occurred while fetching albums.'));

            const req = httpMock.expectOne('https://mybackend.com/album/list?after=2018-01-17T21:12:45.000Z');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
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

  describe('postAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const correctDate = new Date(testAlbum.dateObject);
            correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());

            const body = {
              title: testAlbum.title,
              description: testAlbum.description,
              date: correctDate.toISOString(),
              authorsIds: '1,12'
            };

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.postAlbum(testAlbum).subscribe(album => expect(album).toEqual(testAlbum));

            const req = httpMock.expectOne('https://mybackend.com/album');
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(body);
            req.flush(testAlbum);
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.postAlbum(testAlbum).subscribe(album => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while sending album.'));

            const req = httpMock.expectOne('https://mybackend.com/album');
            expect(req.request.method).toEqual('POST');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('putAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            const correctDate = new Date(testAlbum.dateObject);
            correctDate.setMinutes(correctDate.getMinutes() - correctDate.getTimezoneOffset());

            const body = {
              title: testAlbum.title,
              description: testAlbum.description,
              date: correctDate.toISOString(),
              authorsIds: '1,12'
            };

            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.putAlbum(testAlbum).subscribe(album => expect(album).toEqual(testAlbum));

            const req = httpMock.expectOne('https://mybackend.com/album/1');
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual(body);
            req.flush(testAlbum);
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.putAlbum(testAlbum).subscribe(album => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while sending album.'));

            const req = httpMock.expectOne('https://mybackend.com/album/1');
            expect(req.request.method).toEqual('POST');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('deleteAlbum()', () => {
    it('should send request to backend and return void',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deleteAlbum(666).subscribe();

            const req = httpMock.expectOne('https://mybackend.com/album/666');
            expect(req.request.method).toEqual('DELETE');
            req.flush(of(null));
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.deleteAlbum(666).subscribe(() => fail(),
              error => expect(error.message).toEqual('An error occurred while deleting album.'));

            const req = httpMock.expectOne('https://mybackend.com/album/666');
            expect(req.request.method).toEqual('DELETE');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('searchAlbum()', () => {
    it('should send request to backend and return album list',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');
            const albums = [testAlbum];

            service.searchAlbum('my search').subscribe(a => expect(a).toEqual(albums));

            const req = httpMock.expectOne('https://mybackend.com/album/search/my search');
            expect(req.request.method).toEqual('GET');
            req.flush(albums);
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.searchAlbum('my term').subscribe(() => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while searching albums.'));

            const req = httpMock.expectOne('https://mybackend.com/album/search/my term');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('getAlbumDownloadUrl()', () => {
    it('should send request to backend and return url',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');
            const token = 'MyToKeN1234';

            service.getAlbumDownloadUrl(33).subscribe(url => expect(url)
              .toEqual('https://mybackend.com/album/33/download?token=' + token));

            const req = httpMock.expectOne('https://mybackend.com/album/33/downloadToken');
            expect(req.request.method).toEqual('GET');
            req.flush({ token: token });
          })));

    it('should fail on error',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
            spyOn(appConfig, 'getBackendUrl').and.returnValue('https://mybackend.com');

            service.getAlbumDownloadUrl(33).subscribe(() => fail('observable should not resolve on failed request'),
              error => expect(error.message).toEqual('An error occurred while requesting download url.'));

            const req = httpMock.expectOne('https://mybackend.com/album/33/downloadToken');
            expect(req.request.method).toEqual('GET');
            req.error(new ErrorEvent('Test Error'));
          })));
  });

  describe('commentAlbum()', () => {
    it('should send request to backend and return album',
      async(
        inject([HttpTestingController, AppConfigService, AlbumService],
          (httpMock: HttpTestingController, appConfig: AppConfigService, service: AlbumService) => {
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
