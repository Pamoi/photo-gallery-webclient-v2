import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AlbumService } from '../shared/album.service';

import { Album } from '../shared/album.model';
import { Photo } from '../shared/photo.model';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss'],
  providers: [Location],
  animations: [
    trigger('btnState', [
      state('hidden', style({
        opacity: '0'
      })),
      state('visible', style({})),
      transition('hidden => visible', animate('200ms ease-out')),
      transition('visible => hidden', animate('200ms ease-in'))
    ])
  ]
})

export class PhotoDetailComponent implements OnInit, OnDestroy {
  private static HIDE_BUTTON_DELAY = 2000;

  album: Album;
  loadingError: boolean;
  buttonState = 'visible';
  menuState = 'hidden';

  private index: number;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
              private albumService: AlbumService) {
  }

  get photo(): Photo {
    if (this.album && this.index >= 0) {
      return this.album.photos[this.index];
    }

    return null;
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
    this.sanitizeIndex();

    this.updateLocation();
  }

  previousPhoto(): void {
    if (!this.album || this.album.photos.length === 0) {
      return;
    }

    this.index -= 1;
    this.sanitizeIndex();

    this.updateLocation();
  }

  close(): void {
    if (this.albumService.albumWasShown) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/album/' + this.route.snapshot.params['albumId']);
    }
  }

  toggleMenu() {
    this.menuState = this.menuState === 'hidden' ? 'visible' : 'hidden';
  }

  onDelete(photo: Photo): void {
    const index = this.album.photos.indexOf(photo);
    if (index >= 0) {
      this.album.photos.splice(index, 1);
    }

    if (this.album.photos.length === 0) {
      this.close();
    } else {
      this.sanitizeIndex();
    }
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
        this.index = i;
      }
    });

    this.hideButtons();
  }

  private sanitizeIndex(): void {
    if (this.index >= this.album.photos.length) {
      this.index = 0;
    } else if (this.index < 0) {
      this.index = this.album.photos.length - 1;
    }
  }

  private hideButtons(): void {
    setTimeout(() => {
      this.buttonState = 'hidden';
    }, PhotoDetailComponent.HIDE_BUTTON_DELAY);
  }

  private updateLocation(): void {
    this.location.replaceState('/album/' + this.album.id + /photo/ + this.photo.id);
  }
}
