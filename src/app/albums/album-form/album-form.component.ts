import { Component, OnInit, ViewChild } from '@angular/core';
import { Album } from '../shared/album.model';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';
import { AlbumService } from '../shared/album.service';
import { PhotoService } from '../shared/photo.service';
import { Uploader } from '../shared/uploader.class';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  album: Album;
  uploader: Uploader;
  error: boolean;
  sent = false;

  @ViewChild(NgForm) form: NgForm;

  dateOptions: DatepickerOptions = {
    locale: frLocale,
    maxDate: new Date(),
    displayFormat: 'D MMMM YYYY',
    firstCalendarDay: 1
  };

  constructor(private albumService: AlbumService, private photoService: PhotoService) {
  }

  ngOnInit() {
    this.album = new Album();
    this.album.authors = [];
    this.album.dateObject = new Date();

    this.uploader = this.photoService.getPhotoUploader();
  }

  onSubmit(): void {
    this.error = false;

    if (this.form.invalid || this.uploader.items.length === 0) {
      return;
    }

    this.albumService.postAlbum(this.album).subscribe(album => {
        this.sent = true;
        this.album.id = album.id;
        this.sendPhotos();
      },
      () => this.error = true
    );
  }

  private sendPhotos(): void {
    this.uploader.addRequestParam('albumId', this.album.id);
    this.uploader.addRequestParam('date', this.album.dateObject.toISOString());

    this.uploader.uploadAll();
  }
}
