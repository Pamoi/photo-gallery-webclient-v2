import { Component, OnInit } from '@angular/core';
import { Toast, ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.toastService.getToasts().subscribe(toast => this.displayToast(toast));
  }

  deleteToast(toast: Toast): void {
    const index = this.toasts.indexOf(toast);
    if (index >= 0) {
      this.toasts.splice(index, 1);
    }
  }

  private displayToast(toast: Toast): void {
    this.toasts.push(toast);
    setTimeout(() => {
      this.deleteToast(toast);
    }, toast.duration);
  }
}
