import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginButtonComponent } from './login-button.component';
import { AuthService } from '../shared/auth.service';
import { By } from '@angular/platform-browser';

const authServiceStub = {
  isLoggedIn: false,
  getUsername(): string {
    return '';
  },
  logout(): void {
  }
};

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;
  let auth: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginButtonComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    auth = fixture.debugElement.injector.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show login button if user is not logged in', () => {
    auth.isLoggedIn = false;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.nav-link'));
    expect(btn.nativeElement.innerText).toEqual('Connexion');
  });

  it('should show dropdown button if user is logged in', () => {
    auth.isLoggedIn = true;
    spyOn(auth, 'getUsername').and.returnValue('Toto');
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('#navbarDropdown'));
    expect(btn.nativeElement.innerText).toEqual('Toto');
    btn.nativeElement.click();

    const items = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    expect(items[0].nativeElement.innerText).toEqual('Mon compte');
    expect(items[1].nativeElement.innerText).toEqual('Déconnexion');
  });

  it('should call auth service on logout click', () => {
    auth.isLoggedIn = true;
    spyOn(auth, 'getUsername').and.returnValue('Toto');
    const authSpy = spyOn(auth, 'logout');
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('#navbarDropdown'));
    btn.nativeElement.click();

    const items = fixture.debugElement.queryAll(By.css('.dropdown-item'));
    items[1].nativeElement.click();

    expect(authSpy).toHaveBeenCalled();
  });
});
