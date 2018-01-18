import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Album } from '../shared/album.model';
import { AlbumError, AlbumService } from '../shared/album.service';
import { AppStateService } from '../../core/shared/app-state.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean;
  loadingError: boolean;
  page = 1;
  pendingRequest = false;
  endReached = false;
  scrollOffset = 0;

  get albums() {
    return this.stateService.albumList;
  }

  constructor(private albumService: AlbumService, private stateService: AppStateService) { }

  loadMoreAlbums(): void {
    if (this.pendingRequest) {
      return;
    }

    this.loading = true;
    this.loadingError = false;
    this.pendingRequest = true;

    this.albumService.getAlbumsBefore(this.getOldestDate()).subscribe(albums => {
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

  loadNewAlbums(): void {
    this.albumService.getAlbumsAfter(this.getNewestDate()).subscribe(albums => {
      albums.forEach(a => this.albums.unshift(a));
    });
  }

  ngOnInit(): void {
    if (this.albums.length === 0) {
      this.loadMoreAlbums();
    } else {
      this.loadNewAlbums();
    }
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, this.stateService.listScrollOffset);
  }

  ngOnDestroy(): void {
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.stateService.listScrollOffset = window.scrollY;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.endReached) {
        this.loadMoreAlbums();
      }
    }
  }

  private removeTimezone(date: Date): string {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString();
  }

  private getNewestDate(): string {
    if (this.albums.length === 0) {
      return this.removeTimezone(new Date());
    }

    return this.removeTimezone(new Date(this.albums[0].creationDate));
  }

  private getOldestDate(): string {
    if (this.albums.length === 0) {
      return this.removeTimezone(new Date());
    }

    return this.removeTimezone(new Date(this.albums[this.albums.length - 1].creationDate));
  }
}
