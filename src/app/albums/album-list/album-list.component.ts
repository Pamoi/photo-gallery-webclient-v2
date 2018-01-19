import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { AlbumError, AlbumService } from '../shared/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit, AfterViewInit {
  loading = false;
  loadingError = false;
  pendingRequest = false;
  endReached = false;

  get albums() {
    return this.albumService.localAlbumList;
  }

  constructor(private albumService: AlbumService) { }

  loadMoreAlbums(): void {
    if (this.pendingRequest) {
      return;
    }

    this.loading = true;
    this.loadingError = false;
    this.pendingRequest = true;

    this.albumService.getMoreAlbums().subscribe(() => {
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

  loadNewAlbums(): void {
    this.albumService.getNewAlbums().subscribe();
  }

  ngOnInit(): void {
    if (this.albums.length === 0) {
      this.loadMoreAlbums();
    } else {
      this.loadNewAlbums();
    }
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, this.albumService.listScrollOffset);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.albumService.listScrollOffset = window.scrollY;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.endReached) {
        this.loadMoreAlbums();
      }
    }
  }
}
