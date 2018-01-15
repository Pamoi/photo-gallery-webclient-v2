import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AlbumService } from '../shared/album.service';

import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';


@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  providers: [Location]
})

export class PhotoDetailComponent implements OnInit, OnDestroy {
  album: Album;
  photo: Photo;
  loadingError: boolean;
  private index: number;

  constructor(private route: ActivatedRoute, private location: Location, private albumService: AlbumService) {
  }

  ngOnInit(): void {
    this.getAlbum();
    document.body.style.backgroundColor = '#000000';
  }

  ngOnDestroy() {
    document.body.style.backgroundColor = '';
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
      case 'ArrowRight':
        this.nextPhoto();
        break;

      case 'ArrowLeft':
        this.previousPhoto();
        break;

      case 'Escape':
        this.close();
        break;
    }
  }


  private getAlbum(): void {
    this.loadingError = false;
    const id = +this.route.snapshot.params['albumId'];

    this.albumService.getAlbum(id).subscribe(album => {
      this.setAlbumAndPhoto(album);
    }, () => {
      this.loadingError = true;
    });
  }

  private setAlbumAndPhoto(album: Album): void {
    this.album = album;
    this.index = 0;
    const id = +this.route.snapshot.params['photoId'];
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
