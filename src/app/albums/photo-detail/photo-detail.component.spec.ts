import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PhotoService } from '../shared/photo.service';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PhotoDetailComponent } from './photo-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlbumService } from '../shared/album.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
      imports: [RouterTestingModule, BrowserAnimationsModule],
      declarations: [PhotoDetailComponent],
      providers: [AlbumService, PhotoService, HttpClient, HttpHandler, AppConfigService, {
        provide: ActivatedRoute, useValue: {
          snapshot: { params: { albumId: 13, photoId: 666 } }
        }
      },
        { provide: Location, useValue: locationStub },
        { provide: Router, useValue: routerStub }],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should create', async(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should set body background color to black', async(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    expect(document.body.style.backgroundColor).toEqual('rgb(0, 0, 0)');

    component.ngOnDestroy();
    expect(document.body.style.backgroundColor).toEqual('');
  }));

  it('should query album on creation', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(13);
    expect(component.album).toEqual(album);
    tick(2000);
  }));

  it('should hide buttons after setting album', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();

    expect(component.buttonState).toEqual('visible');

    tick();
    tick(2000);

    expect(component.buttonState).toEqual('hidden');
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

    tick(2000);
  }));

  it('should toggle menu visibility on menu button click', async(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    expect(component.menuState).toEqual('hidden');

    const menuBtn = fixture.debugElement.query(By.css('.toggle-btn'));
    menuBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.menuState).toEqual('visible');

    menuBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.menuState).toEqual('hidden');
  }));

  it('should call nextPhoto() on next zone click', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    const spy = spyOn(component, 'nextPhoto');

    const nextBtn = fixture.debugElement.query(By.css('.next-zone'));
    nextBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    tick(2000);
  }));

  it('should call previousPhoto() on previous zone click', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    fixture.detectChanges();

    const spy = spyOn(component, 'previousPhoto');

    const prevBtn = fixture.debugElement.query(By.css('.prev-zone'));
    prevBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    tick(2000);
  }));

  it('should call Location.back() on close button click if album was shown', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    albumService.albumWasShown = true;
    fixture.detectChanges();

    const locationSpy = spyOn(location, 'back');
    const routerSpy = spyOn(router, 'navigateByUrl');

    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(locationSpy).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();

    tick(2000);
  }));

  it('should call Router.navigateByUrl() on close button click if album was not shown', fakeAsync(() => {
    const album = new Album();
    album.photos = [];
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    albumService.albumWasShown = false;
    fixture.detectChanges();

    const locationSpy = spyOn(location, 'back');
    const routerSpy = spyOn(router, 'navigateByUrl');

    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(locationSpy).not.toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith('/album/13');

    tick(2000);
  }));

  it('should show error message if loading fails', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.photos = [];
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

    tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
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

      tick(2000);
    }));
  });

  describe('onDelete()', () => {
    it('should delete photo', fakeAsync(() => {
      const album = new Album();
      const photo1 = new Photo();
      const photo2 = new Photo();
      photo1.id = 777;
      photo2.id = 666;
      album.photos = [photo1, photo2];
      spyOn(albumService, 'getAlbum').and.returnValue(of(album));

      fixture.detectChanges();
      tick();

      expect(component.photo).toEqual(photo2);

      component.onDelete(photo2);

      expect(component.photo).toEqual(photo1);
      expect(component.album.photos.length).toEqual(1);

      tick(2000);
    }));

    it('should delete photo', fakeAsync(() => {
      const album = new Album();
      const photo = new Photo();
      photo.id = 666;
      album.photos = [photo];
      spyOn(albumService, 'getAlbum').and.returnValue(of(album));
      const spy = spyOn(component, 'close');

        fixture.detectChanges();
      tick();

      expect(component.photo).toEqual(photo);

      component.onDelete(photo);

      expect(spy).toHaveBeenCalled();
      expect(component.photo).toBeUndefined();
      expect(component.album.photos.length).toEqual(0);

      tick(2000);
    }));
  });
});
