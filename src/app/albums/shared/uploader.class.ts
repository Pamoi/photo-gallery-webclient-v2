import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

export class Uploader {
  public items: UploadItem[] = [];
  public hasStarted = false;
  public hasFinished = false;
  public requestFilename: string;
  public progress = 0;

  private index = -1;
  private requestParams: { name: string, value: string}[] = [];
  private totalSize = 0;
  private uploadedSize = 0;

  public onComplete: () => void = () => {};

  constructor(private http: HttpClient, public readonly url: string) {
  }

  get isUploading(): boolean {
    return this.hasStarted && !this.hasFinished;
  }

  addFiles(files: File[]): void {
    if (this.hasStarted) {
      throw new Error('Cannot add files to uploader once upload has started.');
    }

    files.map(f => new UploadItem(f)).forEach(i => {
      this.totalSize += i.file.size;
      this.items.push(i);
    });
  }

  removeItem(item: UploadItem): void {
    if (this.hasStarted) {
      throw new Error('Cannot remove file from uploader once upload has started.');
    }

    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  addRequestParam(name: string, value: string | number): void {
    this.requestParams.push({ name: name, value: '' + value });
  }

  uploadAll(): void {
    this.hasStarted = true;
    this.uploadNext();
  }

  private uploadItem(item: UploadItem): void {
    const body = new FormData();

    this.requestParams.forEach(p => body.append(p.name, p.value));

    body.append(this.requestFilename, item.file);

    const req = new HttpRequest('POST', this.url, body, {
      reportProgress: true
    });

    item.hasStarted = true;
    item.status = UploadStatus.Uploading;

    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const itemProgress = event.loaded / event.total;
        const totalProgress = (this.index + itemProgress) / this.items.length;
        this.progress = Math.round(100 * totalProgress);
        item.progress = Math.round(100 * itemProgress);
      } else if (event instanceof HttpResponse) {
        item.status = UploadStatus.Success;
        item.progress = 100;
        item.hasFinished = true;
        this.uploadedSize += item.file.size;
        this.uploadNext();
      }
    }, () => {
      item.status = UploadStatus.Error;
      item.progress = 100;
      item.hasFinished = true;
      this.uploadedSize += item.file.size;
      this.uploadNext();
    });
  }

  private uploadNext(): void {
    this.index += 1;
    if (this.index >= this.items.length) {
      this.progress = 100;
      this.hasFinished = true;
      this.onComplete();
    } else {
      this.uploadItem(this.items[this.index]);
    }
  }
}

export class UploadItem {
  public progress = 0;
  public hasStarted = false;
  public hasFinished = false;
  public status = UploadStatus.Ready;

  constructor(public readonly file: File) {
  }
}

export const enum UploadStatus {
  Ready,
  Uploading,
  Error,
  Success
}
