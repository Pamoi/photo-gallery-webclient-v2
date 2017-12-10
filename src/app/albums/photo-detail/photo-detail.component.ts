import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AlbumService } from '../shared/album.service';

import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';


@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  providers: [Location]
})

export class PhotoDetailComponent implements OnInit {
  album: Album;
  photo: Photo;
  index: number;

  constructor(private route: ActivatedRoute, private location: Location, private albumService: AlbumService) {
  }

  ngOnInit(): void {
    this.getAlbum();
  }

  nextPhoto(): void {
    if (!this.album || this.album.photos.length === 0) {
      return;
    }

    this.index += 1;

    if (this.index >= this.album.photos.length) {
      this.index = 0;
    }

    this.photo = this.album.photos[this.index];
    this.updateLocation();
  }

  previousPhoto(): void {
    if (!this.album || this.album.photos.length === 0) {
      return;
    }

    this.index -= 1;

    if (this.index < 0) {
      this.index = this.album.photos.length - 1;
    }

    this.photo = this.album.photos[this.index];
    this.updateLocation();
  }

  close(): void {
    this.location.back();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.nextPhoto();
        break;

      case 'ArrowRight':
        this.previousPhoto();
        break;

      case 'Escape':
        this.close();
        break;
    }
  }


  private getAlbum(): void {
    const id = +this.route.snapshot.paramMap.get('albumId');
    this.albumService.getAlbum(id).subscribe(album => this.setAlbumAndPhoto(album));
  }

  private setAlbumAndPhoto(album: Album): void {
    this.album = album;
    const id = +this.route.snapshot.paramMap.get('photoId');
    this.album.photos.forEach((p, i) => {
      if (p.id === id) {
        this.photo = p;
        this.index = i;
      }
    });
  }

  private updateLocation(): void {
    this.location.replaceState('/album/' + this.album.id + /photo/ + this.photo.id);
  }
}
