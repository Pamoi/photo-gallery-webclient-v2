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

  private displayToast(toast: Toast): void {
    this.toasts.push(toast);
    setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      this.toasts.splice(index, 1);
    }, toast.duration);
  }
}
