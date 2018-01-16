import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Photo } from '../shared/photo.model';
import { PhotoService } from '../shared/photo.service';

@Component({
  selector: 'app-photo-thumbnail',
  templateUrl: './photo-thumbnail.component.html',
  styleUrls: ['./photo-thumbnail.component.scss']
})
export class PhotoThumbnailComponent implements OnInit, OnDestroy {
  @Input() photo: Photo;

  @ViewChild('image') image: ElementRef;

  private objectURL: string;

  constructor(private photoService: PhotoService) {
  }

  ngOnInit() {
    this.photoService.getThumbnailPhoto(this.photo).subscribe(blob => this.displayImage(blob));
  }

  ngOnDestroy(): void {
    this.revokeObjectURL();
  }

  private displayImage(blob: Blob): void {
    this.revokeObjectURL();
    this.objectURL = URL.createObjectURL(blob);
    this.image.nativeElement.src = this.objectURL;
  }

  private revokeObjectURL(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }
}
