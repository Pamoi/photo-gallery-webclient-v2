import { TestBed, inject, async } from '@angular/core/testing';

import { ToastDuration, ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
  });

  it('should be created', inject([ToastService], (service: ToastService) => {
    expect(service).toBeTruthy();
  }));

  it('should return sent toasts', async(inject([ToastService], (service: ToastService) => {
    const toasts = service.getToasts();

    toasts.subscribe(toast => {
      expect(toast.message).toEqual('My toast message');
      expect(toast.duration).toEqual(ToastDuration.Short);
      expect(toast.type).toEqual(ToastType.Success);
    });

    service.toast('My toast message', ToastType.Success, ToastDuration.Short);
  })));
});
