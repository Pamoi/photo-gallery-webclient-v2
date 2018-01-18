import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { AppConfigService } from '../../core/shared/app-config.service';

import { Album } from './album.model';

@Injectable()
export class AlbumService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
  }

  getAlbumsBefore(date: string): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/list?before=' + date)
      .pipe(
        catchError(
          (error: any): Observable<Album[]> => {
            if (error.status === 404) {
              throw new AlbumError(true);
            } else {
              throw new Error('An error occurred while fetching albums.');
            }
          }
        )
      );
  }

  getAlbumsAfter(date: string): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/list?after=' + date)
      .pipe(
        catchError(this.throwError<Album[]>('An error occurred while fetching albums.'))
      );
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(this.appConfig.getBackendUrl() + '/album/' + id)
      .pipe(
        catchError(this.throwError<Album>('An error occurred while fetching album.'))
      );
  }

  postAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(this.appConfig.getBackendUrl() + '/album', this.getBody(album)).pipe(
      catchError(this.throwError<Album>('An error occurred while sending album.'))
    );
  }

  putAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(this.appConfig.getBackendUrl() + '/album/' + album.id, this.getBody(album)).pipe(
      catchError(this.throwError<Album>('An error occurred while sending album.'))
    );
  }

  deleteAlbum(id: number): Observable<void> {
    return this.http.delete<void>(this.appConfig.getBackendUrl() + '/album/' + id).pipe(
      catchError(this.throwError<void>('An error occurred while deleting album.'))
    );
  }

  getAlbumDownloadUrl(id: number): Observable<string> {
    return this.http.get<{ token: string }>(this.appConfig.getBackendUrl() + '/album/' + id + '/downloadToken')
      .map(o => this.appConfig.getBackendUrl() + '/album/' + id + '/download?token=' + o.token)
      .pipe(
        catchError(this.throwError<string>('An error occurred while requesting download url.'))
      );
  }

  searchAlbum(term: string): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/search/' + term).pipe(
      catchError(this.throwError<Album[]>('An error occurred while searching albums.'))
    );
  }

  commentAlbum(id: number, text: string): Observable<Album> {
    return this.http.post<Album>(this.appConfig.getBackendUrl() + '/album/' + id + '/comment', {
      text: text
    }).pipe(
      catchError(this.throwError<Album>('An error occurred while sending comment.'))
    );
  }

  deleteComment(albumId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(this.appConfig.getBackendUrl() + '/album/' + albumId + '/comment/' + commentId)
      .pipe(
        catchError(this.throwError<void>('An error occurred while deleting comment.'))
      );
  }

  private getBody(album: Album): { title: string, description: string, date: string, authorsIds: string } {
    album.dateObject.setMinutes(album.dateObject.getMinutes() - album.dateObject.getTimezoneOffset());

    return {
      title: album.title,
      description: album.description,
      date: album.dateObject.toISOString(),
      authorsIds: album.authors.map(u => u.id).join(',')
    };
  }

  private throwError<T>(message: string) {
    return (error: any): Observable<T> => {
      console.error(error);
      throw new Error(message);
    };
  }
}

export class AlbumError extends Error {
  constructor(public endReached: boolean) {
    super();
  }
}
