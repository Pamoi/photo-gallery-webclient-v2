import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AlbumDetailComponent } from './album-detail.component';
import { AlbumService } from '../shared/album.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotoComponent } from '../photo/photo.component';
import { Album } from '../shared/album.model';
import { of } from 'rxjs/observable/of';
import { CoreModule } from '../../core/core.module';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { By } from '@angular/platform-browser';
import { AlbumCommentListComponent } from '../album-comment-list/album-comment-list.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../authentication/shared/auth.service';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let albumService: AlbumService;
  let fixture: ComponentFixture<AlbumDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, FormsModule],
      declarations: [AlbumDetailComponent, AlbumCommentListComponent, AuthorListPipe, PhotoComponent],
      providers: [AlbumService, AuthService, HttpClient, HttpHandler, AppConfigService, {
        provide: ActivatedRoute, useValue: {
          snapshot: { params: { id: 13 } }
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
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
});
