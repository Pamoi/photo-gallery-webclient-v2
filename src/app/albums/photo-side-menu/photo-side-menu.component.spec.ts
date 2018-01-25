import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSideMenuComponent } from './photo-side-menu.component';
import { PhotoService } from '../shared/photo.service';
import { AuthService } from '../../authentication/shared/auth.service';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../../core/core.module';
import { Photo } from '../shared/photo.model';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const photoServiceStub = {
  getPhoto() {
  },

  deletePhoto() {
  }
};

const authServiceStub = {
  isLoggedIn: true,
  isAdmin() {
    return false;
  },
  getUserId() {
    return 1;
  }
};

const toastServiceStub = {
  toast() {
  }
};

describe('PhotoSideMenuComponent', () => {
  let component: PhotoSideMenuComponent;
  let fixture: ComponentFixture<PhotoSideMenuComponent>;
  let photoService: PhotoService;
  let auth: AuthService;
  let toast: ToastService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, CoreModule],
      declarations: [PhotoSideMenuComponent],
      providers: [
        {
          provide: PhotoService,
          useValue: photoServiceStub
        }, {
          provide: AuthService,
          useValue: authServiceStub
        }, {
        provide: ToastService,
          useValue: toastServiceStub
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSideMenuComponent);
    component = fixture.componentInstance;
    photoService = fixture.debugElement.injector.get(PhotoService);
    auth = fixture.debugElement.injector.get(AuthService);
    toast = fixture.debugElement.injector.get(ToastService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should download photo on button click', async(() => {
    const file = new File([''], 'photo.jpg');
    const photo = new Photo();
    photo.id = 1;
    photo.author = {id: 2, username: 'Toto'};

    const urlSpy = spyOn(URL, 'createObjectURL').and.returnValue('http://aaaa-bbbb-cccc/');
    const revokeSpy = spyOn(URL, 'revokeObjectURL');
    const photoSpy = spyOn(photoService, 'getPhoto').and.returnValue(of(file));
    const linkSpy = spyOn(component.downloadLink.nativeElement, 'click');

    component.photo = photo;
    component.state = 'visible';
    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.menu-btn'))[0];
    btn.nativeElement.click();

    expect(photoSpy).toHaveBeenCalledWith(photo);
    expect(urlSpy).toHaveBeenCalledWith(file);

    expect(component.downloadLink.nativeElement.href).toEqual('http://aaaa-bbbb-cccc/');
    expect(linkSpy).toHaveBeenCalled();

    component.ngOnDestroy();
    expect(revokeSpy).toHaveBeenCalledWith('http://aaaa-bbbb-cccc/');
  }));

  it('should show toast on download error', async(() => {
    const photo = new Photo();
    photo.id = 1;
    photo.author = {id: 2, username: 'Toto'};

    spyOn(photoService, 'getPhoto').and.returnValue(Observable.throw(new Error('')));
    const spy = spyOn(toast, 'toast');
    const linkSpy = spyOn(component.downloadLink.nativeElement, 'click');

    component.photo = photo;
    component.state = 'visible';
    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.menu-btn'))[0];
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith('Une erreur est survenue lors du téléchargement de la photo.',
      ToastType.Danger,
      ToastDuration.Medium);
    expect(linkSpy).not.toHaveBeenCalled();
  }));

  it('should delete photo on button click', async(() => {
    const photo = new Photo();
    photo.id = 1;
    photo.author = {id: 1, username: 'Toto'};

    const spy = spyOn(photoService, 'deletePhoto').and.returnValue(of(null));
    const outputSpy = spyOn(component.onDelete, 'emit');

    component.photo = photo;
    component.state = 'visible';
    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.menu-btn'))[1];
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(1);
    expect(outputSpy).toHaveBeenCalledWith(photo);
  }));

  it('should show toast on photo deletion error', async(() => {
    const photo = new Photo();
    photo.id = 1;
    photo.author = {id: 1, username: 'Toto'};

    const spy = spyOn(photoService, 'deletePhoto').and.returnValue(Observable.throw(new Error('')));
    const toastSpy = spyOn(toast, 'toast');
    const outputSpy = spyOn(component.onDelete, 'emit');

    component.photo = photo;
    component.state = 'visible';
    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.menu-btn'))[1];
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(1);
    expect(outputSpy).not.toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith('Une erreur est survenue lors de la suppression de la photo.',
      ToastType.Danger,
      ToastDuration.Medium);
  }));

  it('should not show delete button if user is not author', async(() => {
    const photo = new Photo();
    photo.id = 1;
    photo.author = {id: 2, username: 'Toto'};

    component.photo = photo;
    component.state = 'visible';
    fixture.detectChanges();

    const btn = fixture.debugElement.queryAll(By.css('.menu-btn'))[1];
    expect(btn).toBeUndefined();
  }));
});
