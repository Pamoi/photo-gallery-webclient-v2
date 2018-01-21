import { async, inject, TestBed } from '@angular/core/testing';
import { RandomAlbumResolver } from './random-album-resolver.service';
import { AlbumService } from './album.service';
import { Router } from '@angular/router';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';
import { Album } from './album.model';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

const albumServiceStub = {
  getRandomAlbum() {
  }
};

const routerStub = {
  navigateByUrl() {
  }
};

const toastServiceStub = {
  toast() {
  }
};

describe('RandomAlbumResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RandomAlbumResolver, {
        provide: AlbumService,
        useValue: albumServiceStub
      }, {
        provide: Router,
        useValue: routerStub
      }, {
        provide: ToastService,
        useValue: toastServiceStub
      }]
    });
  });

  it('should be created', inject([RandomAlbumResolver], (service: RandomAlbumResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should get random album and redirect to album detail',
    async(inject([RandomAlbumResolver, AlbumService, Router],
      (service: RandomAlbumResolver, albumService: AlbumService, router: Router) => {
        const album = new Album();
        album.id = 123;

        const albumSpy = spyOn(albumService, 'getRandomAlbum').and.returnValue(of(album));
        const routerSpy = spyOn(router, 'navigateByUrl');

        service.resolve(null, null).subscribe();

        expect(albumSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith('/album/123');
      })));

  it('should show toast on error',
    async(inject([RandomAlbumResolver, AlbumService, Router, ToastService],
      (service: RandomAlbumResolver, albumService: AlbumService, router: Router, toast: ToastService) => {
        const album = new Album();
        album.id = 123;

        const albumSpy = spyOn(albumService, 'getRandomAlbum')
          .and.returnValue(Observable.throw(new Error('error')));
        const routerSpy = spyOn(router, 'navigateByUrl');
        const toastSpy = spyOn(toast, 'toast');

        service.resolve(null, null).subscribe();

        expect(albumSpy).toHaveBeenCalled();
        expect(routerSpy).not.toHaveBeenCalled();
        expect(toastSpy).toHaveBeenCalledWith(
          'Une erreur est survenue lors du chargement d\'un album aléatoire',
          ToastType.Danger,
          ToastDuration.Medium);
      })));
});
