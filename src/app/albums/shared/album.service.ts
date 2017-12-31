import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { never } from 'rxjs/observable/never';
import { catchError } from 'rxjs/operators';

import { AppConfigService } from '../../core/shared/app-config.service';

import { Album } from './album.model';

@Injectable()
export class AlbumService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getAlbums(page: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/list/' + page)
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

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      if (result) {
        return of(result as T);
      } else {
        return never();
      }
    };
  }
}
