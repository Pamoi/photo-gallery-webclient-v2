import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, LoginStatus } from '../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppConfigService } from '../../core/shared/app-config.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [LoginComponent],
      providers: [AuthService, HttpClient, HttpHandler, AppConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    auth = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send credentials on form submit', fakeAsync(() => {
    const spy = spyOn(auth, 'login').and.returnValue(of(LoginStatus.Success));

    component.username = 'Toto';
    component.password = '1234';

    const submitBtn = fixture.debugElement.query(By.css('.btn')).nativeElement;
    submitBtn.click();

    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Toto', '1234');
  }));

  it('should redirect on successful login', fakeAsync(() => {
    const spy = spyOn(auth, 'login').and.returnValue(of(LoginStatus.Success));
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.username = 'Toto';
    component.password = '1234';

    const submitBtn = fixture.debugElement.query(By.css('.btn')).nativeElement;
    submitBtn.click();

    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Toto', '1234');
    expect(routerSpy).toHaveBeenCalledWith('/');
  }));

  it('should display message on invalid credentials', fakeAsync(() => {
    const spy = spyOn(auth, 'login').and.returnValue(of(LoginStatus.BadCredentials));
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.username = 'Toto';
    component.password = '1234';

    const submitBtn = fixture.debugElement.query(By.css('.btn')).nativeElement;
    submitBtn.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;

    expect(msg.innerText).toEqual('Nom d\'utilisateur ou mot de passe invalide.');
    expect(spy).toHaveBeenCalledWith('Toto', '1234');
    expect(routerSpy).not.toHaveBeenCalled();
  }));

  it('should display message on network error', fakeAsync(() => {
    const spy = spyOn(auth, 'login').and.returnValue(of(LoginStatus.NetworkError));
    const routerSpy = spyOn(router, 'navigateByUrl');

    component.username = 'Toto';
    component.password = '1234';

    const submitBtn = fixture.debugElement.query(By.css('.btn')).nativeElement;
    submitBtn.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.alert-warning')).nativeElement;

    expect(msg.innerText).toEqual('Impossible de contacter le serveur distant.');
    expect(spy).toHaveBeenCalledWith('Toto', '1234');
    expect(routerSpy).not.toHaveBeenCalled();
  }));
});
