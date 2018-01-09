import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { ToastDuration, ToastService, ToastType } from '../shared/toast.service';
import { By } from '@angular/platform-browser';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [ToastService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = fixture.debugElement.injector.get(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', fakeAsync(() => {
    const msg = 'My toast message';
    toastService.toast(msg, ToastType.Success, 1);

    tick();
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.alert-success')).nativeElement;
    expect(alert.innerText).toEqual(msg + ' ×');

    tick(2);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.alert'))).toBeNull();
  }));

  it('should delete toast on button click', fakeAsync(() => {
    const msg = 'My toast message';
    toastService.toast(msg, ToastType.Success, 5);

    tick();
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.close')).nativeElement;
    btn.click();

    tick(1);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.alert'))).toBeNull();

    tick(5);
  }));
});
