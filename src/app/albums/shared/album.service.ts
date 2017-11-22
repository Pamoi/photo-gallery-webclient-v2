import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { Album } from './album.model';

@Injectable()
export class AlbumService {
  private albumsUrl = 'http://localhost:8080/album';

  constructor(private http: HttpClient) { }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.albumsUrl + '/list/1')
      .pipe(
        catchError(this.handleError([]))
      );
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(this.albumsUrl + '/' + id)
      .pipe(
        catchError(this.handleError(null))
      );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
