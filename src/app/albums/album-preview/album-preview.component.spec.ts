import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorListPipe } from '../shared/author-list.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { AlbumPreviewComponent } from './album-preview.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';
import { By } from '@angular/platform-browser';


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

  it('should show message if album does not contain photos', () => {
    component.album = new Album();
    component.album.photos = [];

    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.no-photo-message'));
    expect(msg.nativeElement.innerText).toEqual('Cet album ne contient aucune photo.');
  });

  it('should not show message if album contains photos', () => {
    component.album = new Album();
    component.album.photos = [new Photo()];

    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.no-photo-message'));
    expect(msg).toBeNull();
  });
});
