import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() private onFilesAdded: EventEmitter<FileList> = new EventEmitter();

  @HostBinding('class')
  private className = 'dropzone';

  constructor() {
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.className = 'dropzone-over';
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.className = 'dropzone';
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();

    this.className = 'dropzone';
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      this.onFilesAdded.emit(files);
    }
  }
}
