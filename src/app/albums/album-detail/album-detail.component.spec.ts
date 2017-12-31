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

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let albumService: AlbumService;
  let fixture: ComponentFixture<AlbumDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AlbumDetailComponent, AuthorListPipe, PhotoComponent],
      providers: [AlbumService, HttpClient, HttpHandler, AppConfigService, {
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
});
