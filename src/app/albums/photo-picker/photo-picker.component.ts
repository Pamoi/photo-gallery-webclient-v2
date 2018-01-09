import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Uploader, UploadStatus } from '../shared/uploader.class';

@Component({
  selector: 'app-photo-picker',
  templateUrl: './photo-picker.component.html',
  styleUrls: ['./photo-picker.component.scss']
})
export class PhotoPickerComponent implements OnInit {
  @Input() uploader: Uploader;
  @Input() required: boolean;

  @ViewChild('fileButton') fileButton: ElementRef;
  allowedExtensions = ['jpg', 'jpeg', 'png'];

  US = UploadStatus;

  constructor() {
  }

  ngOnInit() {
    const ref = this;

    this.fileButton.nativeElement.onchange = function() {
      ref.addFiles(ref.fileButton.nativeElement.files);
    };
  }

  selectFiles(): void {
    this.fileButton.nativeElement.click();
  }

  addFiles(files: FileList): void {
    if (this.uploader.hasStarted) {
      return;
    }

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const split = file.name.split('.');
      const ext = split.length > 0 ? split[split.length - 1].toLowerCase() : '';

      if (this.allowedExtensions.indexOf(ext) !== -1) {
        validFiles.push(file);
      }
    }

    this.uploader.addFiles(validFiles);
  }
}
