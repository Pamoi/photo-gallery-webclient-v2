import { Component, OnInit } from '@angular/core';

import { Album } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  loading: boolean;
  loadingError: boolean;

  constructor(private albumService: AlbumService) { }

  getAlbums(): void {
    this.loading = true;
    this.loadingError = false;

    this.albumService.getAlbums(1).subscribe(albums => {
      this.albums = albums;
      this.loading = false;
    }, () => {
      this.loadingError = true;
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.getAlbums();
  }
}
