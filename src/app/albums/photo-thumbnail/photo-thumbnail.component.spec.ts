import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PhotoThumbnailComponent } from './photo-thumbnail.component';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PhotoService } from '../shared/photo.service';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';
import { Photo } from '../shared/photo.model';
import { By } from '@angular/platform-browser';

describe('PhotoThumbnailComponent', () => {
  let component: PhotoThumbnailComponent;
  let fixture: ComponentFixture<PhotoThumbnailComponent>;
  let photoService: PhotoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoThumbnailComponent],
      providers: [PhotoService, HttpClient, HttpHandler, AppConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoThumbnailComponent);
    component = fixture.componentInstance;
    photoService = fixture.debugElement.injector.get(PhotoService);
  });

  const testPhoto = new Photo();
  testPhoto.id = 1;

  it('should create', () => {
    spyOn(photoService, 'getThumbnailPhoto').and.returnValue(never());

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show placeholder, load and revoke photo', fakeAsync(() => {
    const url = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const blob = new Blob();
    const serviceSpy = spyOn(photoService, 'getThumbnailPhoto').and.returnValue(of(blob));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');

    component.photo = testPhoto;
    fixture.detectChanges();

    const placeholder = fixture.debugElement.query(By.css('.placeholder'));
    expect(placeholder.nativeElement.offsetWidth).toEqual(200);
    expect(placeholder.nativeElement.offsetHeight).toEqual(200);
    expect(serviceSpy).toHaveBeenCalledWith(testPhoto);

    tick();

    expect(UrlSpy).toHaveBeenCalledWith(blob);
    expect(component.image.nativeElement.src).toMatch(url);
    expect(component.image.nativeElement.classList).toContain('thumbnail');

    fixture.destroy();

    expect(UrlRevokeSpy).toHaveBeenCalledWith(url);
  }));
});
