import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-photo-picker',
  templateUrl: './photo-picker.component.html',
  styleUrls: ['./photo-picker.component.scss']
})
export class PhotoPickerComponent implements OnInit {
  @Input() files: File[];

  @ViewChild('fileButton') fileButton: ElementRef;
  allowedExtensions = ['jpg', 'jpeg', 'png'];

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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const split = file.name.split('.');
      const ext = split.length > 0 ? split[split.length - 1].toLowerCase() : '';

      if (this.allowedExtensions.indexOf(ext) !== -1) {
        this.files.push(file);
      }
    }
  }

  deleteFile(file: File): void {
    const index = this.files.indexOf(file);
    this.files.splice(index, 1);
  }
}
