import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class Toast {
  constructor(public message: string, public type: ToastType, public duration: ToastDuration) {
  }
}

@Injectable()
export class ToastService {
  private toasts = new Subject<Toast>();

  constructor() {
  }

  getToasts(): Observable<Toast> {
    return this.toasts;
  }

  toast(msg: string, type: ToastType, duration: ToastDuration): void {
    this.toasts.next(new Toast(msg, type, duration));
  }
}

export const enum ToastType {
  Success = 'success',
  Danger = 'danger',
  Waring = 'warning',
  Info = 'info',
  Primary = 'primary'
}

export const enum ToastDuration {
  Short = 2000,
  Medium = 3000,
  Long = 5000,
  VeryLong = 10000
}
