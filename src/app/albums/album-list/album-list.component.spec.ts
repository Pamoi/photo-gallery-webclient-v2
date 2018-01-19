import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AlbumService } from '../shared/album.service';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { Album } from '../shared/album.model';
import { of } from 'rxjs/observable/of';
import { CoreModule } from '../../core/core.module';
import 'rxjs/add/observable/throw';
import { AlbumListComponent } from './album-list.component';
import { AlbumPreviewComponent } from '../album-preview/album-preview.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotoService } from '../shared/photo.service';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { PhotoCoverComponent } from '../photo-cover/photo-cover.component';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let albumService: AlbumService;
  let fixture: ComponentFixture<AlbumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule],
      declarations: [AlbumListComponent, AlbumPreviewComponent, AuthorListPipe, PhotoCoverComponent],
      providers: [AlbumService, PhotoService, HttpClient, HttpHandler, AppConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch and set album list on init', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    const albums = [album];
    const spy = spyOn(albumService, 'getMoreAlbums').and.callFake(() => {
      albumService.localAlbumList = albums;
      return of(null);
    });

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.albums).toEqual(albums);
  }));

  it('should show error message if loading fails', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    const albums = [album];

    const spy = spyOn(albumService, 'getMoreAlbums').and.returnValue(Observable.throw(new Error('Error')));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadingError).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.alert-warning'));
    expect(msg.nativeElement.innerText).toEqual('Erreur lors du chargement des albums. Réessayer.');

    spy.and.callFake(() => {
      albumService.localAlbumList.push(album);
      return of(null);
    });
    const link = msg.children[0];
    link.nativeElement.click();

    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.loadingError).toEqual(false);
    expect(component.albums).toEqual(albums);
  }));

  it('should fetch next page on scroll', fakeAsync(() => {
    const date = new Date();
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    album.creationDate = date.toISOString();
    const albums = [album];
    const spy = spyOn(albumService, 'getMoreAlbums').and.callFake(() => {
      albumService.localAlbumList.push(album);
      return of(null);
    });

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.albums).toEqual(albums);

    component.onScroll();

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.albums).toEqual([album, album]);
  }));

  it('should fetch new albums and restore scroll state on creation if state was saved', fakeAsync(() => {
    const album = new Album();
    album.id = 666;
    album.title = 'Saved album';
    album.creationDate = new Date().toISOString();

    albumService.localAlbumList = [album];
    albumService.listScrollOffset = 48;

    const spy = spyOn(albumService, 'getNewAlbums').and.callFake(() => {
      albumService.localAlbumList.push(album);
      return of(null);
    });

    const scrollSpy = spyOn(window, 'scrollTo');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.albums).toEqual([album, album]);
    expect(scrollSpy).toHaveBeenCalledWith(0, 48);
  }));
});
