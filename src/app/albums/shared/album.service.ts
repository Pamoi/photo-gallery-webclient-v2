import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { AppConfigService } from '../../core/app-config.service';

import { Album } from './album.model';
import { Photo } from './photo.model';

@Injectable()
export class AlbumService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/list/1')
      .pipe(
        catchError(this.handleError([]))
      );
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(this.appConfig.getBackendUrl() + '/album/' + id)
      .pipe(
        catchError(this.handleError(null))
      );
  }

  getPhotoUrl(photo: Photo): string {
    return this.appConfig.getBackendUrl() + '/photo/' + photo.id;
  }

  getResizedPhotoUrl(photo: Photo): string {
    return this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/resized';
  }

  getCoverPhotoUrl(photo: Photo): string {
    return this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/cover';
  }

  getThumbnailPhotoUrl(photo: Photo): string {
    return this.appConfig.getBackendUrl() + '/photo/' + photo.id + '/thumb';
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
