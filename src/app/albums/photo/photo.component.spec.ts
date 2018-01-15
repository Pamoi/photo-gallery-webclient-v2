import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoComponent } from './photo.component';
import { PhotoService } from '../shared/photo.service';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Photo } from '../shared/photo.model';
import { of } from 'rxjs/observable/of';
import { CoreModule } from '../../core/core.module';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let photoService: PhotoService;
  let fixture: ComponentFixture<PhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      declarations: [PhotoComponent],
      providers: [PhotoService, HttpClient, HttpHandler, AppConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
    photoService = fixture.debugElement.injector.get(PhotoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and revoke cover photo', async(() => {
    const url = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const blob = new Blob();
    const photo = new Photo();
    photo.id = 666;
    const serviceSpy = spyOn(photoService, 'getCoverPhoto').and.returnValue(of(blob));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');

    component.type = 'cover';
    component.photo = photo;

    fixture.detectChanges();

    expect(serviceSpy).toHaveBeenCalled();
    expect(UrlSpy).toHaveBeenCalledWith(blob);
    expect(component.image.nativeElement.src).toMatch(url);
    expect(component.image.nativeElement.classList).toContain('cover');

    fixture.destroy();

    expect(UrlRevokeSpy).toHaveBeenCalledWith(url);
  }));

  it('should load and revoke resized photo', async(() => {
    const url = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const blob = new Blob();
    const photo = new Photo();
    photo.id = 666;
    const serviceSpy = spyOn(photoService, 'getResizedPhoto').and.returnValue(of(blob));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');
    const spinnerSpy = spyOn(component, 'showSpinner');
    const readySpy = spyOn(component, 'imageIsReady');

    component.type = 'detail';
    component.photo = photo;

    fixture.detectChanges();

    expect(spinnerSpy).toHaveBeenCalled();
    expect(readySpy).toHaveBeenCalled();
    expect(component.loading).toEqual(false);
    expect(serviceSpy).toHaveBeenCalled();
    expect(UrlSpy).toHaveBeenCalledWith(blob);
    expect(component.image.nativeElement.src).toMatch(url);
    expect(component.image.nativeElement.classList).toContain('detail');

    fixture.destroy();

    expect(UrlRevokeSpy).toHaveBeenCalledWith(url);
  }));

  it('should load and revoke thumbnail photo', async(() => {
    const url = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const blob = new Blob();
    const photo = new Photo();
    photo.id = 666;
    const serviceSpy = spyOn(photoService, 'getThumbnailPhoto').and.returnValue(of(blob));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');

    component.type = 'thumbnail';
    component.photo = photo;

    fixture.detectChanges();

    expect(serviceSpy).toHaveBeenCalled();
    expect(UrlSpy).toHaveBeenCalledWith(blob);
    expect(component.image.nativeElement.src).toMatch(url);
    expect(component.image.nativeElement.classList).toContain('thumbnail');

    fixture.destroy();

    expect(UrlRevokeSpy).toHaveBeenCalledWith(url);
  }));

  it('should throw error on invalid type', () => {
    const photo = new Photo();
    photo.id = 666;

    try {
      component.type = 'invalid';
      component.photo = photo;

      fixture.detectChanges();
    } catch (e) {
      expect((e as Error).message).toEqual('Invalid photo component type.');
      return;
    }

    fail('Error should have been thrown.');
  });

  it('should revoke old photo on photo change', async(() => {
    const url1 = 'http://localhost:9876/aaaa-bbbb-cccc-dddd';
    const url2 = 'http://localhost:9876/1111-2222-3333-4444';
    const blob1 = new Blob();
    const blob2 = new Blob();
    const photo1 = new Photo();
    photo1.id = 1;
    const photo2 = new Photo();
    photo2.id = 2;
    const serviceSpy = spyOn(photoService, 'getCoverPhoto').and.returnValue(of(blob1));
    const UrlSpy = spyOn(URL, 'createObjectURL').and.returnValue(url1);
    const UrlRevokeSpy = spyOn(URL, 'revokeObjectURL');

    component.type = 'cover';
    component.photo = photo1;

    fixture.detectChanges();

    expect(serviceSpy).toHaveBeenCalled();
    expect(UrlSpy).toHaveBeenCalledWith(blob1);
    expect(component.image.nativeElement.src).toMatch(url1);

    serviceSpy.and.returnValue(of(blob2));
    UrlSpy.and.returnValue(url2);

    component.photo = photo2;

    fixture.detectChanges();

    expect(serviceSpy).toHaveBeenCalled();
    expect(UrlSpy).toHaveBeenCalledWith(blob2);
    expect(component.image.nativeElement.src).toMatch(url2);
    expect(UrlRevokeSpy).toHaveBeenCalledWith(url1);
  }));
});
