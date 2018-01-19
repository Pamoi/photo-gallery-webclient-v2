import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { AppConfigService } from '../../core/shared/app-config.service';

import { Album } from './album.model';

/**
 * The AlbumService offers methods to get, post, update and delete albums. In addition
 * it maintains a local list of the loaded albums which is updated when albums are
 * fetched or modified locally.
 */
@Injectable()
export class AlbumService {
  localAlbumList: Album[] = [];
  listScrollOffset = 0;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
  }

  getMoreAlbums(): Observable<void> {
    return this.getAlbumsBefore(this.getOldestDate().toISOString()).map(albums => {
      albums.forEach(a => this.localAlbumList.push(a));
    });
  }

  getNewAlbums(): Observable<void> {
    return this.getAlbumsAfter(this.getNewestDate().toISOString()).map(albums => {
      albums.forEach(a => this.localAlbumList.unshift(a));
    });
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
      .map(a => this.updateLocalAlbum(a))
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
    return this.http.post<Album>(this.appConfig.getBackendUrl() + '/album/' + album.id, this.getBody(album))
      .map(a => this.updateLocalAlbum(a))
      .pipe(
        catchError(this.throwError<Album>('An error occurred while sending album.'))
      );
  }

  deleteAlbum(id: number): Observable<void> {
    return this.http.delete<void>(this.appConfig.getBackendUrl() + '/album/' + id)
      .map(() => this.deleteLocalAlbum(id))
      .pipe(
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
    })
      .map(a => this.updateLocalAlbum(a))
      .pipe(
        catchError(this.throwError<Album>('An error occurred while sending comment.'))
      );
  }

  deleteComment(albumId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(this.appConfig.getBackendUrl() + '/album/' + albumId + '/comment/' + commentId)
      .map(() => this.deleteLocalComment(albumId, commentId))
      .pipe(
        catchError(this.throwError<void>('An error occurred while deleting comment.'))
      );
  }

  private updateLocalAlbum(album: Album): Album {
    const index = this.localAlbumList.map(b => b.id).indexOf(album.id);
    if (index >= 0) {
      this.localAlbumList[index] = album;
    }

    return album;
  }

  private deleteLocalAlbum(id: number): void {
    const index = this.localAlbumList.map(b => b.id).indexOf(id);
    if (index >= 0) {
      this.localAlbumList.splice(index, 1);
    }
  }

  private deleteLocalComment(albumId: number, commentId: number): void {
    const index = this.localAlbumList.map(b => b.id).indexOf(albumId);
    if (index >= 0) {
      this.localAlbumList[index].comments =
        this.localAlbumList[index].comments.filter(c => c.id !== commentId);
    }
  }

  private getBody(album: Album): { title: string, description: string, date: string, authorsIds: string } {
    return {
      title: album.title,
      description: album.description,
      date: this.removeTimezone(album.dateObject).toISOString(),
      authorsIds: album.authors.map(u => u.id).join(',')
    };
  }

  private throwError<T>(message: string) {
    return (error: any): Observable<T> => {
      console.error(error);
      throw new Error(message);
    };
  }

  private removeTimezone(date: Date): Date {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  }

  private getOldestDate(): Date {
    if (this.localAlbumList.length === 0) {
      return this.removeTimezone(new Date());
    }

    return this.removeTimezone(new Date(this.localAlbumList[this.localAlbumList.length - 1].creationDate));
  }

  private getNewestDate(): Date {
    if (this.localAlbumList.length === 0) {
      return this.removeTimezone(new Date());
    }

    return this.removeTimezone(new Date(this.localAlbumList[0].creationDate));
  }
}

export class AlbumError extends Error {
  constructor(public endReached: boolean) {
    super();
  }
}
