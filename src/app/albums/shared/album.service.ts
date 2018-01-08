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

  getAlbums(page: number): Observable<Album[]> {
    return this.http.get<Album[]>(this.appConfig.getBackendUrl() + '/album/list/' + page)
      .pipe(
        catchError(
          (error: any): Observable<Album[]> => {
            if (error.status === 404) {
              throw new AlbumError(true);
            } else {
              throw new Error('An error occurred while fetching album list.');
            }
          }
        )
      );
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(this.appConfig.getBackendUrl() + '/album/' + id)
      .pipe(
        catchError(this.throwError<Album>('An error occurred while fetching album.'))
      );
  }

  postAlbum(album: Album): Observable<Album> {
    const body = {
      title: album.title,
      description: album.description,
      date: album.dateObject.toISOString(),
      authorsIds: album.authors.map(u => u.id).join(',')
    };

    return this.http.post<Album>(this.appConfig.getBackendUrl() + '/album', body).pipe(
      catchError(this.throwError<Album>('An error occurred while sending album.'))
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
