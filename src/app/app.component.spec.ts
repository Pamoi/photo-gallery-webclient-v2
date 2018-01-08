import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './authentication/shared/auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppConfigService } from './core/shared/app-config.service';
import { ToastService } from './core/shared/toast.service';
import { CoreModule } from './core/core.module';
import { AlbumsModule } from './albums/albums.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, AlbumsModule, RouterTestingModule],
      declarations: [AppComponent],
      providers: [AuthService, HttpClient, HttpHandler, AppConfigService, ToastService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
