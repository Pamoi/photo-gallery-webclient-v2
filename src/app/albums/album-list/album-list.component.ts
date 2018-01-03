import { Component, HostListener, OnInit } from '@angular/core';

import { Album } from '../shared/album.model';
import { AlbumError, AlbumService } from '../shared/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  loading: boolean;
  loadingError: boolean;
  page = 1;
  pendingRequest = false;
  endReached = false;

  constructor(private albumService: AlbumService) { }

  getAlbums(page: number): void {
    if (this.pendingRequest) {
      return;
    }

    this.loading = true;
    this.loadingError = false;
    this.pendingRequest = true;

    this.albumService.getAlbums(page).subscribe(albums => {
      albums.forEach(a => this.albums.push(a));
      this.page += 1;
      this.loading = false;
      this.pendingRequest = false;
    }, (error: AlbumError) => {
      this.loading = false;
      this.pendingRequest = false;

      if (error.endReached) {
        this.endReached = true;
      } else {
        this.loadingError = true;
      }
    });
  }

  ngOnInit(): void {
    this.getAlbums(this.page);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.endReached) {
        this.getAlbums(this.page);
      }
    }
  }
}
