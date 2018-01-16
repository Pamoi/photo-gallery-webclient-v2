import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PhotoCoverComponent } from './photo-cover.component';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PhotoService } from '../shared/photo.service';
import { Photo } from '../shared/photo.model';
import { of } from 'rxjs/observable/of';
import { never } from 'rxjs/observable/never';

describe('PhotoCoverComponent', () => {
  let component: PhotoCoverComponent;
  let fixture: ComponentFixture<PhotoCoverComponent>;
  let photoService: PhotoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoCoverComponent],
      providers: [PhotoService, HttpClient, HttpHandler, AppConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCoverComponent);
    component = fixture.componentInstance;
    photoService = fixture.debugElement.injector.get(PhotoService);
  });

  const testPhoto = new Photo();
  testPhoto.id = 1;

  it('should create', () => {
    spyOn(photoService, 'getCoverPhoto').and.returnValue(never());

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

    it('should show placeholder, load and revoke photo', fakeAsync(() => {
    const url = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const blob = new Blob();
    const serviceSpy = spyOn(photoService, 'getCoverPhoto').and.returnValue(of(blob));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');

    component.photo = testPhoto;
    fixture.detectChanges();

    const expectedHeight = Math.round(component.placeholder.nativeElement.offsetWidth / 1.7);
    expect(component.placeholder.nativeElement.style.height).toEqual(expectedHeight + 'px');
    expect(serviceSpy).toHaveBeenCalledWith(testPhoto);

    tick();
    component.image.nativeElement.onload();

    expect(component.placeholder.nativeElement.style.height).toEqual('auto');
    expect(UrlSpy).toHaveBeenCalledWith(blob);
    expect(component.image.nativeElement.src).toMatch(url);
    expect(component.image.nativeElement.classList).toContain('cover');

    fixture.destroy();

    expect(UrlRevokeSpy).toHaveBeenCalledWith(url);
  }));
});
