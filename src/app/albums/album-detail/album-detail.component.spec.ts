import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AlbumDetailComponent } from './album-detail.component';
import { AlbumService } from '../shared/album.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { Album } from '../shared/album.model';
import { of } from 'rxjs/observable/of';
import { CoreModule } from '../../core/core.module';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../authentication/shared/auth.service';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';
import { Photo } from '../shared/photo.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let albumService: AlbumService;
  let auth: AuthService;
  let toast: ToastService;
  let router: Router;
  let fixture: ComponentFixture<AlbumDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, FormsModule],
      declarations: [AlbumDetailComponent, AuthorListPipe],
      providers: [AlbumService, AuthService, HttpClient, HttpHandler, AppConfigService, AuthService, ToastService, {
        provide: ActivatedRoute, useValue: {
          snapshot: { params: { id: 13 } }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
    auth = fixture.debugElement.injector.get(AuthService);
    toast = fixture.debugElement.injector.get(ToastService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch and set album on init', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    const spy = spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(13);
    expect(component.album).toEqual(album);
  }));

  it('should center the photo thumbnails', () => {
    fixture.detectChanges();

    const containerWidth = component.fullWidthContainer.nativeElement.offsetWidth;
    const thumbnailWidth = component.thumbnailContainer.nativeElement.offsetWidth;
    const margin = (containerWidth - thumbnailWidth) / 2;

    expect(containerWidth).toBeGreaterThan(0);
    expect(thumbnailWidth).toBeGreaterThan(0);
    expect(thumbnailWidth % component.thumbnailWidth).toEqual(0);
    expect(component.thumbnailContainer.nativeElement.style.marginLeft)
      .toEqual(margin + 'px');
  });

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

  it('should show edit button if user is author', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.authors = [{ id: 3, username: 'Toto' }];

    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    spyOn(auth, 'getUserId').and.returnValue(3);
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.btn-primary'))[1];
    expect(btn.nativeElement.innerText).toEqual('Modifier ');
  }));

  it('should show edit button if user is admin', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.authors = [{ id: 3, username: 'Toto' }];

    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    spyOn(auth, 'getUserId').and.returnValue(44);
    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'isAdmin').and.returnValue(true);

    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.btn-primary'))[1];
    expect(btn.nativeElement.innerText).toEqual('Modifier ');
  }));

  it('should show delete button if user is admin', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.authors = [{ id: 3, username: 'Toto' }];

    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    spyOn(auth, 'getUserId').and.returnValue(44);
    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'isAdmin').and.returnValue(true);

    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    expect(btn.nativeElement.innerText).toEqual('Supprimer');
  }));

  it('should redirect after album deletion', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.authors = [{ id: 3, username: 'Toto' }];

    spyOn(albumService, 'getAlbum').and.returnValue(of(album));
    spyOn(auth, 'getUserId').and.returnValue(3);
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    const albumSpy = spyOn(albumService, 'deleteAlbum').and.returnValue(of(null));
    const toastSpy = spyOn(toast, 'toast');
    const routerSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    expect(btn.nativeElement.innerText).toEqual('Supprimer');
    btn.nativeElement.click();

    const btn2 = fixture.debugElement.queryAll(By.css('.btn-danger'))[1];
    expect(btn2.nativeElement.innerText).toEqual('Supprimer');
    btn2.nativeElement.click();

    expect(albumSpy).toHaveBeenCalledWith(13);
    expect(toastSpy).toHaveBeenCalledWith('Album supprimé.', ToastType.Success, ToastDuration.Medium);
    expect(routerSpy).toHaveBeenCalledWith('/');
  }));

  it('should display toast on album deletion error', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.authors = [{ id: 3, username: 'Toto' }];

    const albumSpy = spyOn(albumService, 'deleteAlbum').and.returnValue(Observable.throw(new Error('')));
    const toastSpy = spyOn(toast, 'toast');
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.album = album;
    component.deleteAlbum();

    expect(albumSpy).toHaveBeenCalledWith(13);
    expect(toastSpy)
      .toHaveBeenCalledWith('Erreur lors de la suppression de l\'album', ToastType.Danger, ToastDuration.Medium);
    expect(routerSpy).not.toHaveBeenCalled();
  }));

  it('should download album on button click', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.photos = [new Photo()];

    const url = 'https://download.com/album/123';

    const albumSpy = spyOn(albumService, 'getAlbumDownloadUrl').and.returnValue(of(url));
    const linkSpy = spyOn(component.downloadLink.nativeElement, 'click');

    component.album = album;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-primary'));
    expect(btn.nativeElement.innerText).toEqual('Télécharger');
    btn.nativeElement.click();

    expect(albumSpy).toHaveBeenCalledWith(13);
    expect(component.downloadLink.nativeElement.href).toEqual(url);
    expect(linkSpy).toHaveBeenCalled();
  }));

  it('should show toast on download error', async(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.photos = [new Photo()];


    const albumSpy = spyOn(albumService, 'getAlbumDownloadUrl')
      .and.returnValue(Observable.throw(new Error('')));
    const linkSpy = spyOn(component.downloadLink.nativeElement, 'click');
    const toastSpy = spyOn(toast, 'toast');

    component.album = album;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-primary'));
    btn.nativeElement.click();

    expect(albumSpy).toHaveBeenCalledWith(13);
    expect(linkSpy).not.toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith('Une erreur est survenue lors du téléchargement de l\'album',
      ToastType.Danger, ToastDuration.Medium);
  }));
});
