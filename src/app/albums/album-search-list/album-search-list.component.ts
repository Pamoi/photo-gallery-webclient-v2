import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../shared/album.service';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../shared/album.model';

@Component({
  selector: 'app-album-search-list',
  templateUrl: './album-search-list.component.html',
  styleUrls: ['./album-search-list.component.scss']
})
export class AlbumSearchListComponent implements OnInit {
  term: string;
  albums: Album[];
  loading: boolean;
  loadingError: boolean;

  constructor(private albumService: AlbumService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.term = params['term'];
      this.getAlbums();
    });
  }

  getAlbums(): void {
    this.loading = true;
    this.loadingError = false;

    this.albumService.searchAlbum(this.term).subscribe((albums) => {
      this.loading = false;
      this.albums = albums;
    }, () => {
      this.loading = false;
      this.loadingError = true;
    });
  }
}
