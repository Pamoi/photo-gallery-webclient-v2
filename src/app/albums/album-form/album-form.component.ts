import { Component, OnInit, ViewChild } from '@angular/core';
import { Album } from '../shared/album.model';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';
import { AlbumService } from '../shared/album.service';
import { PhotoService } from '../shared/photo.service';
import { Uploader } from '../shared/uploader.class';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  album: Album;
  uploader: Uploader;
  error: boolean;
  sending = false;
  sent = false;
  loading = false;
  isModification = false;

  @ViewChild(NgForm) form: NgForm;

  dateOptions: DatepickerOptions = {
    locale: frLocale,
    maxDate: new Date(),
    displayFormat: 'D MMMM YYYY',
    firstCalendarDay: 1
  };

  constructor(private albumService: AlbumService, private photoService: PhotoService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.album = new Album();
    this.album.authors = [];
    this.album.dateObject = new Date();
    this.uploader = this.photoService.getPhotoUploader();

    if (this.route.snapshot.params['id']) {
      const id = +this.route.snapshot.params['id'];
      this.isModification = true;
      this.loading = true;

      this.albumService.getAlbum(id).subscribe(album => {
        this.album = album;
        this.album.dateObject = new Date(this.album.date);
        this.loading = false;
      });
    }
  }

  onSubmit(): void {
    this.error = false;

    if (this.form.invalid || (!this.isModification && this.uploader.items.length === 0)) {
      return;
    }

    this.sending = true;

    if (this.isModification) {
      this.albumService.putAlbum(this.album).subscribe(() => {
          this.sending = false;
          this.sent = true;
          this.sendPhotos();
        },
        () => {
          this.error = true;
          this.sending = false;
        }
      );
    } else {
      this.albumService.postAlbum(this.album).subscribe(album => {
          this.sending = false;
          this.sent = true;
          this.album.id = album.id;
          this.sendPhotos();
        },
        () => {
          this.error = true;
          this.sending = false;
        }
      );
    }
  }

  private sendPhotos(): void {
    this.uploader.addRequestParam('albumId', this.album.id);
    this.uploader.addRequestParam('date', this.album.dateObject.toISOString());

    this.uploader.uploadAll();
  }
}
