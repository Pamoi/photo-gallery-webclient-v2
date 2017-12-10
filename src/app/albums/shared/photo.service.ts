import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

import { AppConfigService } from '../../core/app-config.service';
import { Photo } from './photo.model';

@Injectable()
export class PhotoService {
  private blobCache: { [url: string]: Blob } = {};

  constructor(private http: HttpClient, private appConfig: AppConfigService) { }

  getPhoto(photo: Photo): Observable<Blob> {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id);
  }

  getResizedPhoto(photo: Photo): Observable<Blob>  {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/resized');
  }

  getCoverPhoto(photo: Photo): Observable<Blob>  {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/cover');
  }

  getThumbnailPhoto(photo: Photo): Observable<Blob>  {
    return this.getFile(this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/thumb');
  }

  private getFile(url: string): Observable<Blob> {
    if (this.blobCache[url]) {
      return of(this.blobCache[url]);
    }

    return this.http.get(url, { responseType: 'blob' }).map(blob => {
      this.blobCache[url] = blob;
      return blob;
    });
  }
}
