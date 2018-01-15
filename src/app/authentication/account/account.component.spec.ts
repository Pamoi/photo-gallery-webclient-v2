import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigService } from '../../core/shared/app-config.service';
import { AuthService, LoginStatus } from '../shared/auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { CoreModule } from '../../core/core.module';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let auth: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, CoreModule],
      providers: [AuthService, AppConfigService, HttpClient, HttpHandler],
      declarations: [AccountComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    auth = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService to change password', fakeAsync(() => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'getUsername').and.returnValue('Toto');
    const spy = spyOn(auth, 'setPassword').and.returnValue(of(LoginStatus.Success));

    component.old.setValue('password123');
    component.new.setValue('12341234');
    component.confirm.setValue('12341234');

    fixture.detectChanges();
    tick();

    fixture.debugElement.query(By.css('.send-btn')).nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith('Toto', 'password123', '12341234');
    expect(component.status).toEqual(LoginStatus.Success);
    const alert = fixture.debugElement.query(By.css('.alert-success')).nativeElement;
    expect(alert.innerText).toEqual('Mot de passe changé avec succès.');
  }));

  it('should display error on bad old password', fakeAsync(() => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'getUsername').and.returnValue('Toto');
    const spy = spyOn(auth, 'setPassword').and.returnValue(of(LoginStatus.BadCredentials));

    component.old.setValue('password123');
    component.new.setValue('12341234');
    component.confirm.setValue('12341234');

    fixture.detectChanges();
    tick();

    fixture.debugElement.query(By.css('.send-btn')).nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith('Toto', 'password123', '12341234');
    expect(component.status).toEqual(LoginStatus.BadCredentials);
    const alert = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(alert.innerText).toEqual('Ancien mot de passe invalide.');
  }));

  it('should display error on network error', fakeAsync(() => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);
    spyOn(auth, 'getUsername').and.returnValue('Toto');
    const spy = spyOn(auth, 'setPassword').and.returnValue(of(LoginStatus.NetworkError));

    component.old.setValue('password123');
    component.new.setValue('12341234');
    component.confirm.setValue('12341234');

    fixture.detectChanges();
    tick();

    fixture.debugElement.query(By.css('.send-btn')).nativeElement.click();

    fixture.detectChanges();
    tick();

    expect(spy).toHaveBeenCalledWith('Toto', 'password123', '12341234');
    expect(component.status).toEqual(LoginStatus.NetworkError);
    const alert = fixture.debugElement.query(By.css('.alert-warning')).nativeElement;
    expect(alert.innerText).toEqual('Impossible de contacter le serveur distant.');
  }));

  it('should show error on missing old password', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    component.old.setValue('');
    component.old.markAsTouched();

    fixture.detectChanges();

    expect(component.old.invalid).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(msg.nativeElement.innerText).toEqual('L\'ancien mot de passe est requis.\n');
  });

  it('should show error on missing new password', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    component.new.setValue('');
    component.new.markAsTouched();

    fixture.detectChanges();

    expect(component.new.invalid).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(msg.nativeElement.innerText).toEqual('Le mot de passe est requis.\n');
  });

  it('should show error on too short new password', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    component.new.setValue('1234');
    component.new.markAsTouched();

    fixture.detectChanges();

    expect(component.new.invalid).toEqual(true);

    const msg = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(msg.nativeElement.innerText).toEqual('Le mot de passe doit contenir au moins 8 caractères.\n');
  });

  it('should show error on different confirm password', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(true);

    component.new.setValue('12341234');
    component.new.markAsTouched();
    component.confirm.setValue('12431234');
    component.confirm.markAsTouched();

    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(msg.nativeElement.innerText).toEqual('Doit être identique au mot de passe.\n');
  });

  it('should show text if user is not logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(false);

    const msg = fixture.debugElement.query(By.css('div'));
    expect(msg.nativeElement.innerText).toEqual('Veuillez vous connecter pour accéder à votre compte.');
  });
});
