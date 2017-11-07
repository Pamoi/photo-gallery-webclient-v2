import { Component, Input } from '@angular/core';

import { Album } from '../shared/album.model';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss']
})

export class AlbumPreviewComponent {
  @Input() album: Album;

  getCoverUrl(): string {
    return 'https://api.mgirod.ch/photo/' + this.album.photos[0].id + '/resized';
  }
}
