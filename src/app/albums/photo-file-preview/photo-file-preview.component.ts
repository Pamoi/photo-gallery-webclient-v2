import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

/**
 * Utility class to sequentially execute functions with a configurable delay between executions.
 */
class SequentialExecutor {
  private taskQueue: (() => void)[] = [];
  private isExecuting = false;

  constructor(private delay: number) {
  }

  addTask(task: () => void) {
    this.taskQueue.push(task);
    this.executeNext();
  }

  executeNext() {
    if (!this.isExecuting) {
      const task = this.taskQueue.shift();

      if (task) {
        this.isExecuting = true;
        task();

        setTimeout(() => {
          this.isExecuting = false;
          this.executeNext();
        }, this.delay);
      }
    }
  }
}

/**
 * Utility function to read EXIF orientation tag from file. For convenience the callback is called with
 * orientation = 1 (horizontal) on error.
 *
 * @param {File} file
 * @param {(oritentation: number) => void} callback
 */
function getOrientation(file: File, callback: (oritentation: number) => void) {
  const reader = new FileReader();

  reader.onloadend = () => {
    const data = new DataView(reader.result);
    // Position in file.
    let index = 0;
    let orientation = 1;

    // Check first 2 bytes to see if image is JPEG.
    if (reader.result.length < 2 || data.getUint16(index) !== 0xFFD8) {
      callback(orientation);
      return;
    }

    index += 2;
    // Maximum index to read in file.
    const max = file.size - 2;

    while (index < max) {
      const value = data.getUint16(index);
      index += 2;

      if (value === 0xFFE1) {
        if (data.getUint32(index += 2, false) !== 0x45786966) {
          // Should not happen, if so return default orientation.
          callback(orientation);
          return;
        }

        const isLittleEndian = data.getUint16(index += 6, false) === 0x4949;

        index += data.getUint32(index + 4, isLittleEndian);

        const tags = data.getUint16(index, isLittleEndian);
        index += 2;

        for (let i = 0; i < tags; i++) {
          if (data.getUint16(index + (i * 12), isLittleEndian) === 0x0112) {
            orientation = data.getUint16(index + (i * 12) + 8, isLittleEndian);
            callback(orientation);
            return;
          }
        }
        // tslint:disable:no-bitwise
      } else if ((value & 0xFF00) !== 0xFF00) {
        break;
      } else {
        index += data.getUint16(index, false);
      }
    }

    // Orientation was not found, return default value.
    callback(orientation);
  };

  reader.readAsArrayBuffer(file);
}

@Component({
  selector: 'app-photo-file-preview',
  templateUrl: './photo-file-preview.component.html',
  styleUrls: ['./photo-file-preview.component.scss']
})
export class PhotoFilePreviewComponent implements OnInit, OnDestroy {

  private static EXECUTOR_DELAY = 400;
  private static executor = new SequentialExecutor(PhotoFilePreviewComponent.EXECUTOR_DELAY);

  @Input() file: File;
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  ready = false;

  @ViewChild('canvas') private canvas: ElementRef;
  private url: string;

  constructor() {
  }

  ngOnInit() {
    PhotoFilePreviewComponent.executor.addTask(() => {
      getOrientation(this.file, (o) => this.displayImage(o));
    });
  }

  ngOnDestroy() {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }
  }

  private displayImage(orientation: number) {
    this.url = URL.createObjectURL(this.file);
    const ctx = this.canvas.nativeElement.getContext('2d');

    const img = new Image();
    img.src = this.url;

    img.onload = () => {
      const ratio = img.width / img.height;
      let width = img.width;
      let height = img.height;

      if (width > this.maxWidth) {
        width = this.maxWidth;
        height = width * (1 / ratio);
      }

      if (height > this.maxHeight) {
        height = Math.min(this.maxHeight, this.maxWidth * (1 / ratio));
        width = height * ratio;
      }

      const canvas = this.canvas.nativeElement;

      if (4 < orientation && orientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (orientation) {
        case 1:
          break;
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
        default:
          break;
      }

      this.ready = true;
      ctx.drawImage(img, 0, 0, width, height);
    };
  }
}
