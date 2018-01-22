import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Photo } from '../shared/photo.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PhotoService } from '../shared/photo.service';
import { AuthService } from '../../authentication/shared/auth.service';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';

@Component({
  selector: 'app-photo-side-menu',
  templateUrl: './photo-side-menu.component.html',
  styleUrls: ['./photo-side-menu.component.scss'],
  animations: [
    trigger('menuState', [
      state('hidden', style({
        transform: 'translateX(-250px)'
      })),
      state('visible', style({})),
      transition('hidden => visible', animate('100ms ease-out')),
      transition('visible => hidden', animate('100ms ease-in'))
    ])
  ]
})
export class PhotoSideMenuComponent implements OnDestroy {
  @Input() photo: Photo;
  @Input() state = 'hidden';

  @Output() onDelete = new EventEmitter<Photo>();

  @ViewChild('downloadLink') downloadLink: ElementRef;

  deleting = false;
  downloading = false;

  private url: string;

  constructor(private photoService: PhotoService, private auth: AuthService, private toast: ToastService) {
  }

  ngOnDestroy() {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }
  }

  isUserAuthor(): boolean {
    if (this.photo && this.auth.isLoggedIn) {
      return this.auth.isAdmin() || this.auth.getUserId() === this.photo.author.id;
    }

    return false;
  }

  downloadPhoto(): void {
    if (this.url) {
      this.triggerDownload();
      return;
    }

    this.downloading = true;

    this.photoService.getPhoto(this.photo).subscribe(blob => {
      this.downloading = false;
      this.url = URL.createObjectURL(blob);
      this.triggerDownload();
    }, () => {
      this.downloading = false;
      this.toast.toast('Une erreur est survenue lors du téléchargement de la photo.',
        ToastType.Danger,
        ToastDuration.Medium);
    });
  }

  deletePhoto(): void {
    this.deleting = true;

    this.photoService.deletePhoto(this.photo.id).subscribe(() => {
      this.deleting = false;
      this.onDelete.emit(this.photo);
    }, () => {
      this.deleting = false;
      this.toast.toast('Une erreur est survenue lors de la suppression de la photo.',
        ToastType.Danger,
        ToastDuration.Medium);
    });
  }

  private triggerDownload(): void {
    this.downloadLink.nativeElement.href = this.url;
    this.downloadLink.nativeElement.click();
  }
}
