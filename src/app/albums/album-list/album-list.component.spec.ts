import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AlbumService } from '../shared/album.service';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { PhotoComponent } from '../photo/photo.component';
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

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let albumService: AlbumService;
  let fixture: ComponentFixture<AlbumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule],
      declarations: [AlbumListComponent, AlbumPreviewComponent, AuthorListPipe, PhotoComponent],
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
    const spy = spyOn(albumService, 'getAlbums').and.returnValue(of(albums));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(1);
    expect(component.albums).toEqual(albums);
  }));

  it('should show error message if loading fails', fakeAsync(() => {
    const album = new Album();
    album.id = 13;
    album.title = 'THE album';
    const albums = [album];

    const spy = spyOn(albumService, 'getAlbums').and.returnValue(Observable.throw(new Error('Error')));

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadingError).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.alert-warning'));
    expect(msg.nativeElement.innerText).toEqual('Erreur lors du chargement des albums. Réessayer.');

    spy.and.returnValue(of(albums));
    const link = msg.children[0];
    link.nativeElement.click();

    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.loadingError).toEqual(false);
    expect(component.albums).toEqual(albums);
  }));
});
