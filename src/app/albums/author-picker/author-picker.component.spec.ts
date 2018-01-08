import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPickerComponent } from './author-picker.component';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../authentication/shared/auth.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../shared/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../shared/user.model';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

describe('AuthorPickerComponent', () => {
  let component: AuthorPickerComponent;
  let fixture: ComponentFixture<AuthorPickerComponent>;
  let userService: UserService;
  let auth: AuthService;

  const toto: User = { id: 1, username: 'Toto' };
  const titi: User = { id: 2, username: 'Titi' };
  const geralt: User = { id: 3, username: 'Géralt' };
  const sampleUsers: User[] = [toto, titi, geralt];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AuthenticationModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [AuthorPickerComponent],
      providers: [AuthService, HttpClient, HttpHandler, AppConfigService, UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPickerComponent);
    component = fixture.componentInstance;
    component.authors = [];
    userService = fixture.debugElement.injector.get(UserService);
    auth = fixture.debugElement.injector.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load user list on create', async(() => {
    const userSpy = spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));

    fixture.detectChanges();

    expect(userSpy).toHaveBeenCalled();
    expect(component.userList).toEqual(sampleUsers);
  }));

  it('should filter users by name prefix', async(() => {
    component.authors = [];
    const userSpy = spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    const authSpy = spyOn(auth, 'getUserId').and.returnValue(4);

    component.name = 't';
    fixture.detectChanges();

    expect(userSpy).toHaveBeenCalled();
    expect(authSpy).toHaveBeenCalled();
    expect(component.matchingUsers()).toEqual([toto, titi]);
  }));

  it('should filter out users that are already authors', async(() => {
    component.authors = [{ id: 2, username: 'Titi' }];
    const userSpy = spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    const authSpy = spyOn(auth, 'getUserId').and.returnValue(4);

    component.name = 't';
    fixture.detectChanges();

    expect(userSpy).toHaveBeenCalled();
    expect(authSpy).toHaveBeenCalled();
    expect(component.matchingUsers()).toEqual([toto]);
  }));

  it('should filter out connected user', async(() => {
    component.authors = [];
    const userSpy = spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    const authSpy = spyOn(auth, 'getUserId').and.returnValue(2);

    component.name = 't';
    fixture.detectChanges();

    expect(userSpy).toHaveBeenCalled();
    expect(authSpy).toHaveBeenCalled();
    expect(component.matchingUsers()).toEqual([toto]);
  }));


  it('should display matching user list on input', async(() => {
    spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    spyOn(auth, 'getUserId').and.returnValue(55);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#name')).nativeElement;
    input.value = 't';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.userList).toEqual(sampleUsers);
    const names = fixture.debugElement.query(By.css('.name-list'));
    expect(names.children.length).toEqual(2);
    expect(names.children[0].nativeElement.innerText).toEqual('Toto');
    expect(names.children[1].nativeElement.innerText).toEqual('Titi');
  }));

  it('should set authors on click on user name in the list', async(() => {
    spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    spyOn(auth, 'getUserId').and.returnValue(55);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#name')).nativeElement;
    input.value = 't';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const names = fixture.debugElement.query(By.css('.name-list'));
    names.children[0].nativeElement.click();

    expect(component.authors).toEqual([toto]);
  }));

  it('should delete user from author list on delete button click', async(() => {
    spyOn(userService, 'getUsers').and.returnValue(of(sampleUsers));
    spyOn(auth, 'getUserId').and.returnValue(55);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#name')).nativeElement;
    input.value = 't';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.userList).toEqual(sampleUsers);
    const names = fixture.debugElement.query(By.css('.name-list'));
    names.children[0].nativeElement.click();

    fixture.detectChanges();

    expect(component.name).toEqual('');
    const users = fixture.debugElement.query(By.css('.user-list'));
    expect(users.children.length).toEqual(1);

    const btn = fixture.debugElement.query(By.css('.delete-btn'));
    btn.nativeElement.click();

    fixture.detectChanges();

    expect(component.authors).toEqual([]);
  }));

  it('should display message on user list fetch error', async(() => {
    const userSpy = spyOn(userService, 'getUsers').and.returnValue(Observable.throw(new Error()));

    fixture.detectChanges();

    expect(userSpy).toHaveBeenCalled();
    expect(component.userList).toEqual([]);

    const msg = fixture.debugElement.query(By.css('.alert-warning'));
    expect(msg.nativeElement.innerText)
      .toEqual('Erreur lors du chargement de la liste des utilisateurs. Réessayer.');

    msg.children[0].nativeElement.click();
    expect(userSpy).toHaveBeenCalledTimes(2);
  }));
});
