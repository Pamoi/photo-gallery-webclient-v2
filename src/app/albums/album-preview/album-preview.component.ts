import { Component, Input, OnInit } from '@angular/core';

import { AlbumService } from '../shared/album.service';

import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss']
})

export class AlbumPreviewComponent implements OnInit {
  @Input() album: Album;
  coverPhoto: Photo;

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.coverPhoto = this.album.photos[Math.floor(Math.random() * this.album.photos.length)];
  }

  getImageUrl(photo: Photo): string {
    return this.albumService.getCoverPhotoUrl(photo);
  }
}
