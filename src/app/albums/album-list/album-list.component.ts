import { Component, OnInit } from '@angular/core';

import { Album } from '../shared/album.model';
import { AlbumService } from '../shared/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit {
  albums: Album[] = [];

  constructor(private albumService: AlbumService) { }

  getAlbums(): void {
    this.albumService.getAlbums(1).subscribe(albums => this.albums = albums);
  }

  ngOnInit(): void {
    this.getAlbums();
  }
}
