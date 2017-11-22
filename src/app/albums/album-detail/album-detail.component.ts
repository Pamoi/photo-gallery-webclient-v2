import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Album } from '../shared/album.model';

import { AlbumService } from '../shared/album.service';
import { Photo } from '../shared/photo.model';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})

export class AlbumDetailComponent implements OnInit {
  album: Album;

  constructor(private route: ActivatedRoute, private albumService: AlbumService) {}

  ngOnInit(): void {
    this.getAlbum();
  }

  getAlbum(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(album => this.album = album);
  }

  getPhotoUrl(photo: Photo): string {
    return 'http://localhost:8080/photo/' + photo.id + '/thumb';
  }
}
