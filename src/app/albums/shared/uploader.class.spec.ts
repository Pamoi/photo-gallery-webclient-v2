import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Uploader, UploadItem, UploadStatus } from './uploader.class';
import { HttpClient } from '@angular/common/http';

describe('Uploader', function () {
  let uploader: Uploader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    uploader = new Uploader(TestBed.get(HttpClient), 'https://mybackend.com/upload');
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should initialize correctly', () => {
    expect(uploader.url).toEqual('https://mybackend.com/upload');
    expect(uploader.items).toEqual([]);
    expect(uploader.hasStarted).toEqual(false);
    expect(uploader.hasFinished).toEqual(false);
    expect(uploader.progress).toEqual(0);
  });

  it('should create UploadItems when files are added', () => {
    const file = new File(['1234'], 'myfile.txt');
    const files: any = [file];

    uploader.addFiles(files);

    expect(uploader.items.length).toEqual(1);
    const item = uploader.items[0];
    expect(item.status).toEqual(UploadStatus.Ready);
    expect(item.progress).toEqual(0);
    expect(item.file).toEqual(file);
    expect(item.hasStarted).toEqual(false);
    expect(item.hasFinished).toEqual(false);
  });

  it('should remove item from queue on removeItem call', () => {
    const file = new File(['1234'], 'myfile.txt');
    const files: any = [file];

    uploader.addFiles(files);
    expect(uploader.items.length).toEqual(1);
    const item = uploader.items[0];

    uploader.removeItem(item);

    expect(uploader.items.length).toEqual(0);
  });

  it('should not remove non existing item', () => {
    const file = new File(['1234'], 'myfile.txt');
    const file2 = new File(['5678'], 'myfile2.txt');
    const files: any = [file];
    const item = new UploadItem(file2);

    uploader.addFiles(files);
    expect(uploader.items.length).toEqual(1);

    uploader.removeItem(item);
    expect(uploader.items.length).toEqual(1);
  });

  it('should throw on file list modifications once upload has started', () => {
    const file = new File(['1234'], 'myfile.txt');
    const files: any = [file];

    uploader.addFiles(files);
    uploader.hasStarted = true;

    const file2 = new File(['5678'], 'myfile2.txt');
    const files2: any = [file2];

    try {
      uploader.addFiles(files2);
      fail('addFiles should have thrown exception');
    } catch (e) {
      expect(e.message).toEqual('Cannot add files to uploader once upload has started.');
    }

    const item = uploader.items[0];

    try {
      uploader.removeItem(item);
      fail('removeItem should have thrown exception');
    } catch (e) {
      expect(e.message).toEqual('Cannot remove file from uploader once upload has started.');
    }
  });

  it('should send upload requests', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const file = new File(['1234'], 'myfile.txt');
      const files: any = [file];

      uploader.addFiles(files);
      const item = uploader.items[0];
      uploader.uploadAll();

      expect(uploader.hasStarted).toEqual(true);
      expect(item.hasStarted).toEqual(true);
      expect(item.status).toEqual(UploadStatus.Uploading);

      const req = httpMock.expectOne('https://mybackend.com/upload');
      expect(req.request.method).toEqual('POST');
      req.flush(null);

      expect(uploader.progress).toEqual(100);
      expect(uploader.hasFinished).toEqual(true);
      expect(item.hasFinished).toEqual(true);
      expect(item.status).toEqual(UploadStatus.Success);
      expect(item.progress).toEqual(100);
    }));

  it('should set status on error', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const file = new File(['1234'], 'myfile.txt');
      const files: any = [file];

      uploader.addFiles(files);
      const item = uploader.items[0];
      uploader.uploadAll();

      const req = httpMock.expectOne('https://mybackend.com/upload');
      req.error(new ErrorEvent(''));

      expect(uploader.progress).toEqual(100);
      expect(uploader.hasFinished).toEqual(true);
      expect(item.hasFinished).toEqual(true);
      expect(item.status).toEqual(UploadStatus.Error);
      expect(item.progress).toEqual(100);
    }));

  it('should send one request per file', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      const file = new File(['1234'], 'myfile.txt');
      const file2 = new File(['1234'], 'myfile.txt');
      const files: any = [file, file2];

      uploader.addFiles(files);
      uploader.uploadAll();

      const req = httpMock.expectOne('https://mybackend.com/upload');
      req.flush(null);

      const req2 = httpMock.expectOne('https://mybackend.com/upload');
      req2.flush(null);

      expect(uploader.progress).toEqual(100);
      expect(uploader.hasFinished).toEqual(true);
    }));
});
