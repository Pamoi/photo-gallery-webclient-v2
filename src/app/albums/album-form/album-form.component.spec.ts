import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumFormComponent } from './album-form.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlbumService } from '../shared/album.service';
import { PhotoService } from '../shared/photo.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppConfigService } from '../../core/shared/app-config.service';
import { of } from 'rxjs/observable/of';
import { Album } from '../shared/album.model';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { never } from 'rxjs/observable/never';
import { NgDatepickerModule } from 'ng2-datepicker';

describe('AlbumFormComponent', () => {
  const fakeRoute = {
    snapshot: {
      params: {
        id: undefined
      }
    }
  };

  let component: AlbumFormComponent;
  let fixture: ComponentFixture<AlbumFormComponent>;
  let albumService: AlbumService;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, NgDatepickerModule],
      declarations: [AlbumFormComponent],
      providers: [AlbumService, PhotoService, HttpClient, HttpHandler, AppConfigService, {
        provide: ActivatedRoute,
        useValue: fakeRoute
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumFormComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
    route = fixture.debugElement.injector.get(ActivatedRoute);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show correct title for new album', () => {
    fixture.detectChanges();
    expect(component.isModification).toEqual(false);
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.innerText).toEqual('Ajouter un album');
  });

  it('should show correct title for album edition', () => {
    route.snapshot.params['id'] = 1;
    spyOn(albumService, 'getAlbum').and.returnValue(never());

    fixture.detectChanges();

    expect(component.isModification).toEqual(true);
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.innerText).toEqual('Modifier un album');
  });

  it('should get album for album edition', async(() => {
    const album = new Album();
    album.id = 666;
    album.title = 'Title';
    album.description = 'Blabla';
    album.dateObject = new Date();

    route.snapshot.params['id'] = 1;
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();

    expect(component.album).toEqual(album);
  }));

  it('should post album on form submit', () => {
    fixture.detectChanges();

    const file = new File([''], 'photo.jpg');
    const files: any = [file];
    const album = new Album();
    album.id = 666;

    const spy = spyOn(albumService, 'postAlbum').and.returnValue(of(album));

    component.album.title = 'Title';
    component.uploader.addFiles(files);
    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(component.album);
    expect(component.album.id).toEqual(666);
    expect(component.sent).toEqual(true);
    expect(component.form.submitted).toEqual(true);
  });

  it('should put album on edit form submit', () => {
    const album = new Album();
    album.id = 666;
    album.title = 'Title';
    album.description = 'Blabla';
    album.dateObject = new Date();

    route.snapshot.params['id'] = 1;
    spyOn(albumService, 'getAlbum').and.returnValue(of(album));

    fixture.detectChanges();

    const spy = spyOn(albumService, 'putAlbum').and.returnValue(of(album));

    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(component.album);
    expect(component.sent).toEqual(true);
    expect(component.form.submitted).toEqual(true);
  });

  it('should disable submit button after album creation', () => {
    fixture.detectChanges();

    const file = new File([''], 'photo.jpg');
    const files: any = [file];
    const album = new Album();
    album.id = 666;

    spyOn(albumService, 'postAlbum').and.returnValue(of(album));

    component.album.title = 'Title';
    component.uploader.addFiles(files);
    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    fixture.detectChanges();

    expect(btn.nativeElement.disabled).toEqual(true);
  });

  it('should upload photos if album was created successfully', () => {
    fixture.detectChanges();

    const file = new File([''], 'photo.jpg');
    const files: any = [file];
    const album = new Album();
    album.id = 666;

    spyOn(albumService, 'postAlbum').and.returnValue(of(album));
    const configSpy = spyOn(component.uploader, 'addRequestParam');
    const uploadSpy = spyOn(component.uploader, 'uploadAll');
    const date = new Date();

    component.album.title = 'Title';
    component.album.dateObject = date;
    component.uploader.addFiles(files);
    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    expect(configSpy).toHaveBeenCalledTimes(2);
    expect(configSpy).toHaveBeenCalledWith('albumId', 666);
    expect(configSpy).toHaveBeenCalledWith('date', date.toISOString());
    expect(uploadSpy).toHaveBeenCalled();
  });

  it('should not post album if form is invalid', () => {
    fixture.detectChanges();

    const spy = spyOn(albumService, 'postAlbum');

    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    expect(spy).not.toHaveBeenCalled();
    expect(component.form.submitted).toEqual(true);
  });

  it('should display message on upload termination', () => {
    fixture.detectChanges();
    component.uploader.hasFinished = true;
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.alert-success'));
    expect(msg.nativeElement.innerText).toEqual('Envoi terminé. Voir l\'album.');
  });

  it('should display message on posting error', () => {
    fixture.detectChanges();

    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    spyOn(albumService, 'postAlbum').and.returnValue(Observable.throw(new Error('')));

    component.album.title = 'Title';
    component.uploader.addFiles(files);
    const btn = fixture.debugElement.query(By.css('.send-btn'));
    btn.nativeElement.click();

    fixture.detectChanges();

    expect(component.error).toEqual(true);
    const msg = fixture.debugElement.query(By.css('.alert-danger'));
    expect(msg.nativeElement.innerText).toEqual('Une erreur est survenue lors de l\'envoi de l\'album.');
  });
});
