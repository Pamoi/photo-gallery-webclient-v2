import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Photo } from '../shared/photo.model';
import { PhotoService } from '../shared/photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnDestroy {
  private static SHOW_SPINNER_DELAY = 400;

  @Input() type: string;
  @ViewChild('image') image: ElementRef;
  loading = false;

  private _photo: Photo;
  private objectURL: string;
  private isImageReady = false;

  constructor(private photoService: PhotoService) { }

  @Input()
  public set photo(photo: Photo) {
    if (photo !== this._photo) {
      this._photo = photo;
      this.getImage();
    }
  }

  ngOnDestroy(): void {
    this.revokeObjectURL();
  }

  private showSpinner(): void {
    this.isImageReady = false;

    setTimeout(() => {
      if (!this.isImageReady) {
        this.image.nativeElement.src = '';
        this.loading = true;
      }
    }, PhotoComponent.SHOW_SPINNER_DELAY);
  }

  private imageIsReady(): void {
    this.isImageReady = true;
    this.loading = false;
  }

  private getImage(): void {
    if (!this._photo) {
      return;
    }

    switch (this.type) {
      case 'detail':
        this.showSpinner();
        this.photoService.getResizedPhoto(this._photo).subscribe(blob => this.displayImage(blob));
        break;

      case 'cover':
        this.photoService.getCoverPhoto(this._photo).subscribe(blob => this.displayImage(blob));
        break;

      case 'thumbnail':
        this.photoService.getThumbnailPhoto(this._photo).subscribe(blob => this.displayImage(blob));
        break;

      default:
        throw new Error('Invalid photo component type.');
    }
  }

  private displayImage(blob: Blob) {
    this.revokeObjectURL();
    this.objectURL = URL.createObjectURL(blob);
    this.image.nativeElement.src = this.objectURL;
    this.imageIsReady();
  }

  private revokeObjectURL(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }

}
