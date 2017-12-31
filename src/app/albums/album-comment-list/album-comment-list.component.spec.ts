import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AlbumCommentListComponent } from './album-comment-list.component';
import { AuthService } from '../../authentication/shared/auth.service';
import { AlbumService } from '../shared/album.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppConfigService } from '../../core/shared/app-config.service';
import { FormsModule } from '@angular/forms';
import { Album } from '../shared/album.model';
import { Comment } from '../shared/comment.model';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';

describe('AlbumCommentListComponent', () => {
  let component: AlbumCommentListComponent;
  let fixture: ComponentFixture<AlbumCommentListComponent>;
  let albumService: AlbumService;
  let auth: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [AuthService, AlbumService, HttpClient, HttpHandler, AppConfigService],
      declarations: [AlbumCommentListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumCommentListComponent);
    component = fixture.componentInstance;
    albumService = fixture.debugElement.injector.get(AlbumService);
    auth = fixture.debugElement.injector.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display album comments', fakeAsync(() => {
    const album = new Album();
    album.id = 1;
    const comment = new Comment();
    comment.id = 1;
    comment.text = 'The comment text';
    comment.date = '2017-11-20T21:06:51+0100';
    comment.author = { id: 1, username: 'Toto' };
    album.comments = [comment];

    component.album = album;

    fixture.detectChanges();
    tick();

    const td = fixture.debugElement.query(By.css('td'));
    expect(td.nativeElement.innerText).toEqual('Toto le 20.11.2017 à 21:06\nThe comment text');
  }));

  it('should send new comments', fakeAsync(() => {
    const album = new Album();
    album.id = 1;
    album.comments = [];

    const comment = new Comment();
    comment.id = 1;
    comment.text = 'The comment text';
    comment.date = '2017-11-20T21:06:51+0100';
    comment.author = { id: 1, username: 'Toto' };

    const spy = spyOn(albumService, 'commentAlbum');

    component.album = album;

    fixture.detectChanges();
    tick();

    component.commentText = 'The comment text';
    fixture.debugElement.query(By.css('.send-btn')).nativeElement.click();
    album.comments = [comment];
    spy.and.returnValue(album);

    fixture.detectChanges();
    tick();

    expect(component.album.comments.length).toEqual(1);
    const td = fixture.debugElement.query(By.css('td'));
    expect(td.nativeElement.innerText).toEqual('Toto le 20.11.2017 à 21:06\nThe comment text');
    expect(spy).toHaveBeenCalledWith(1, 'The comment text');
  }));

  it('should delete comments', fakeAsync(() => {
    const album = new Album();
    album.id = 1;
    const comment = new Comment();
    comment.id = 1;
    comment.text = 'The comment text';
    comment.date = '2017-11-20T21:06:51+0100';
    comment.author = { id: 1, username: 'Toto' };
    album.comments = [comment];

    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'getUserId').and.returnValue(1);
    const spy = spyOn(albumService, 'deleteComment').and.returnValue(of(undefined));

    component.album = album;

    fixture.detectChanges();
    tick();

    const btn = fixture.debugElement.query(By.css('.delete-btn'));
    btn.nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith(1, 1);
    expect(component.album.comments.length).toBe(0);
  }));

  it('should not show delete button if user is not author of comment', fakeAsync(() => {
    const album = new Album();
    album.id = 1;
    const comment = new Comment();
    comment.id = 1;
    comment.text = 'The comment text';
    comment.date = '2017-11-20T21:06:51+0100';
    comment.author = { id: 1, username: 'Toto' };
    album.comments = [comment];

    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'getUserId').and.returnValue(2);

    component.album = album;

    fixture.detectChanges();
    tick();

    const btn = fixture.debugElement.query(By.css('.delete-btn'));
    expect(btn).toBeNull();
  }));
});
