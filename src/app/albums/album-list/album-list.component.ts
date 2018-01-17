import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Album } from '../shared/album.model';
import { AlbumError, AlbumService } from '../shared/album.service';
import { AppStateService } from '../../core/shared/app-state.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html'
})

export class AlbumListComponent implements OnInit, AfterViewInit, OnDestroy {
  private static STATE_KEY = 'AlbumListComponent';

  albums: Album[] = [];
  loading: boolean;
  loadingError: boolean;
  page = 1;
  pendingRequest = false;
  endReached = false;
  scrollOffset = 0;

  constructor(private albumService: AlbumService, private stateService: AppStateService) { }

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
    const state = this.stateService.getState(AlbumListComponent.STATE_KEY);

    if (state) {
      this.albums = state.albums;
      this.page = state.page;
    } else {
      this.getAlbums(this.page);
    }
  }

  ngAfterViewInit(): void {
    const state = this.stateService.getState(AlbumListComponent.STATE_KEY);

    if (state) {
      window.scrollTo(0, state.scrollOffset);
    }
  }

  ngOnDestroy(): void {
    const state = {
      albums: this.albums,
      page: this.page,
      scrollOffset: this.scrollOffset
    };

    this.stateService.setState(AlbumListComponent.STATE_KEY, state);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollOffset = window.scrollY;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (!this.endReached) {
        this.getAlbums(this.page);
      }
    }
  }
}
