import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Photo } from '../shared/photo.model';
import { PhotoService } from '../shared/photo.service';

@Component({
  selector: 'app-photo-cover',
  templateUrl: './photo-cover.component.html',
  styleUrls: ['./photo-cover.component.scss']
})
export class PhotoCoverComponent implements OnInit, OnDestroy {
  private static PLACEHOLDER_ASPECT_RATIO = 1.7;

  @Input() photo: Photo;

  @ViewChild('image', {static: false}) image: ElementRef;
  @ViewChild('placeholder', {static: true}) placeholder: ElementRef;

  private objectURL: string;
  private isImageLoaded = false;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit() {
    this.photoService.getCoverPhoto(this.photo).subscribe(blob => this.displayImage(blob));
    this.setPlaceholderHeight();
  }

  ngOnDestroy(): void {
    this.revokeObjectURL();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setPlaceholderHeight();
  }

  private displayImage(blob: Blob): void {
    this.revokeObjectURL();
    this.objectURL = URL.createObjectURL(blob);
    this.image.nativeElement.src = this.objectURL;
    this.image.nativeElement.onload = () => this.onImageLoad();
  }

  private onImageLoad(): void {
    this.isImageLoaded = true;
    this.placeholder.nativeElement.style.height = 'auto';
  }

  private setPlaceholderHeight(): void {
    if (!this.isImageLoaded) {
      const width = this.placeholder.nativeElement.offsetWidth;
      const height = width / PhotoCoverComponent.PLACEHOLDER_ASPECT_RATIO;
      this.placeholder.nativeElement.style.height = Math.round(height) + 'px';
    }
  }

  private revokeObjectURL(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }
}
