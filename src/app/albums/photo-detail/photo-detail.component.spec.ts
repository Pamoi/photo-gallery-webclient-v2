import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PhotoService } from '../shared/photo.service';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PhotoDetailComponent } from './photo-detail.component';
import { PhotoComponent } from '../photo/photo.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlbumService } from '../shared/album.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';

const locationStub = {
  back(): void {
  },

  replaceState(path: string): void {
  }
};

const routerStub = {
  navigateByUrl(url: string) {
  }
};

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let albumService: AlbumService;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PhotoDetailComponent, PhotoComponent],
      providers: [AlbumService, PhotoService, HttpClient, HttpHandler, AppConfigService, {
        provide: ActivatedRoute, useValue: {
          snapshot: { params: { albumId: 13, photoId: 666 } }
        }
      },
        { provide: Location, useValue: locationStub },
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
    location = fixture.debugElement.injector.get(Location);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should query album on creation', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(13);
    expect(component.album).toEqual(album);
  }));

  it('should get photo from album', fakeAsync(() => {
    const album = new Album();
    const photo = new Photo();
    photo.id = 666;
    album.photos = [new Photo(), photo, new Photo()];
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(13);
    expect(component.album).toEqual(album);
    expect(component.photo).toEqual(photo);
  }));

  it('should call nextPhoto() on button click', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    const spy = spyOn(component, 'nextPhoto');

    const bar = fixture.debugElement.query(By.css('.button-bar'));
    const nextBtn = bar.children[2];
    nextBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should call previousPhoto() on button click', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    const spy = spyOn(component, 'previousPhoto');

    const bar = fixture.debugElement.query(By.css('.button-bar'));
    const prevBtn = bar.children[0];
    prevBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should call router.navigateByUrl() on close button click if album is set', fakeAsync(() => {
    const album = new Album();
    album.id = 123;
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    const locationSpy = spyOn(location, 'back');
    const spy = spyOn(router, 'navigateByUrl');

    const bar = fixture.debugElement.query(By.css('.button-bar'));
    const closeBtn = bar.children[1];
    closeBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('/album/123');
    expect(locationSpy).not.toHaveBeenCalled();
  }));

  it('should call Location.back() on close button click if album is not set', fakeAsync(() => {
    spyOn(albumService, 'getAlbum').and.returnValue(Observable.throw(new Error('')));
    fixture.detectChanges();

    const routerSpy = spyOn(router, 'navigateByUrl');
    const spy = spyOn(location, 'back');

    const bar = fixture.debugElement.query(By.css('.button-bar'));
    const closeBtn = bar.children[1];
    closeBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  }));

  it('should show error message if loading fails', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(Observable.throw(new Error('Error')));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadingError).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.alert-warning'));
    expect(msg.nativeElement.innerText).toEqual('Erreur lors du chargement de l\'album. Réessayer.');

    spy.and.returnValue(of(album));
    const link = msg.children[0];
    link.nativeElement.click();

    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.loadingError).toEqual(false);
    expect(component.album).toEqual(album);
  }));

  describe('nextPhoto()', () => {
    it('should display next photo', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 666;
      photo2.id = 777;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo1);
      component.nextPhoto();

      expect(component.photo).toEqual(photo2);
    }));

    it('should loop at the end of photo list', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 1;
      photo2.id = 666;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo2);

      component.nextPhoto();

      expect(component.photo).toEqual(photo1);
    }));

    it('should not crash on empty photo list', fakeAsync(() => {
      const album = new Album();
      album.photos = [];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toBeUndefined();

      component.nextPhoto();

      expect(component.photo).toBeUndefined();
    }));

    it('should update location', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 666;
      photo2.id = 777;
      album.id = 13;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));
      const locationSpy = spyOn(location, 'replaceState');

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo1);
      component.nextPhoto();

      expect(locationSpy).toHaveBeenCalledWith('/album/13/photo/777');
    }));
  });

  describe('previousPhoto()', () => {
    it('should display previous photo', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 777;
      photo2.id = 666;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo2);

      component.previousPhoto();

      expect(component.photo).toEqual(photo1);
    }));

    it('should loop at the beginning of photo list', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 666;
      photo2.id = 777;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo1);

      component.previousPhoto();

      expect(component.photo).toEqual(photo2);
    }));

    it('should not crash on empty photo list', fakeAsync(() => {
      const album = new Album();
      album.photos = [];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toBeUndefined();

      component.previousPhoto();

      expect(component.photo).toBeUndefined();
    }));

    it('should update location', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 666;
      photo2.id = 777;
      album.id = 13;
      album.photos = [photo1, photo2];
      const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));
      const locationSpy = spyOn(location, 'replaceState');

      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(13);
      expect(component.album).toEqual(album);
      expect(component.photo).toEqual(photo1);

      component.previousPhoto();

      expect(locationSpy).toHaveBeenCalledWith('/album/13/photo/777');
    }));
  });
});
