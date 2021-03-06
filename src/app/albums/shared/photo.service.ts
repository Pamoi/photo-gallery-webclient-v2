import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { never } from 'rxjs/observable/never';
import 'rxjs/add/operator/map';

import { AppConfigService } from '../../core/shared/app-config.service';
import { Photo } from './photo.model';
import { catchError } from 'rxjs/operators';
import { Uploader } from './uploader.class';
import { pipe } from 'rxjs/Rx';

@Injectable()
export class PhotoService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) { }

  getPhoto(photo: Photo): Observable<Blob> {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id);
  }

  getResizedPhoto(photo: Photo): Observable<Blob> {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/resized');
  }

  getCoverPhoto(photo: Photo): Observable<Blob> {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/cover');
  }

  getThumbnailPhoto(photo: Photo): Observable<Blob> {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/thumb');
  }

  getPhotoUploader(): Uploader {
    const uploader = new Uploader(this.http, this.appConfig.getBackendUrl() + '/photo');
    uploader.requestFilename = 'photo';

    return uploader;
  }

  deletePhoto(id: number): Observable<void> {
    return this.http.delete(this.appConfig.getBackendUrl() + '/photo/' + id)
      .map(() => null)
      .pipe(
        catchError(this.throwError('Error while deleting photo.'))
      );
  }

  private getFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).map(blob => {
      return blob;
    }).pipe(
      catchError(this.handleError(null))
    );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      if (result) {
        return of(result);
      }

      return never();
    };
  }

  private throwError<T>(message: string) {
    return (error: any): Observable<T> => {
      console.error(error);
      throw new Error(message);
    };
  }
}
