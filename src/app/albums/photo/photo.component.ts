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

  @ViewChild('image', {static: false}) image: ElementRef;
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

  private getImage(): void {
    if (this._photo) {
      this.showSpinner();
      this.photoService.getResizedPhoto(this._photo).subscribe(blob => this.displayImage(blob));
    }
  }

  private displayImage(blob: Blob) {
    this.revokeObjectURL();
    this.objectURL = URL.createObjectURL(blob);
    this.image.nativeElement.src = this.objectURL;
    this.isImageReady = true;
    this.loading = false;
  }

  private revokeObjectURL(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }

}
