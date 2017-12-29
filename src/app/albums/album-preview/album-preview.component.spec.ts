import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { AlbumPreviewComponent } from './album-preview.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';


describe('AlbumPreviewComponent', () => {
  let component: AlbumPreviewComponent;
  let fixture: ComponentFixture<AlbumPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AlbumPreviewComponent, AuthorListPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumPreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.album = new Album();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should pick one photo of the album as cover photo', () => {
    component.album = new Album();
    component.album.photos = [new Photo(), new Photo(), new Photo()];

    fixture.detectChanges();

    expect(component.coverPhoto).toBeDefined();
    expect(component.album.photos.indexOf(component.coverPhoto)).toBeGreaterThanOrEqual(0);
  });
});
