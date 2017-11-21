import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Album } from './album.model';

@Injectable()
export class AlbumService {
  private albumsUrl = 'http://localhost:8080/album/list/1';

  constructor(private http: Http) { }

  getAlbums(): Promise<Album[]> {
    return this.http.get(this.albumsUrl)
      .toPromise()
      .then(response => response.json() as Album[])
      .catch(this.handleError);
  }

  handleError(error: any): Promise<Album[]> {
    console.error('Error while fetching albums: ', error);
    return Promise.reject(error.message || error);
  }
}
