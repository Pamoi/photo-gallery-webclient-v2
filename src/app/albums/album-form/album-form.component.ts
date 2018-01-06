import { Component, OnInit } from '@angular/core';
import { Album } from '../shared/album.model';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  album: Album;

  dateOptions: DatepickerOptions = {
    locale: frLocale,
    maxDate: new Date(),
    displayFormat: 'D MMMM YYYY',
    firstCalendarDay: 1
  };

  constructor() {}

  ngOnInit() {
    this.album = new Album();
    this.album.authors = [];
    this.album.photoFiles = [];
    this.album.dateObject = new Date();
  }

  onSubmit(): void {
    console.log(JSON.stringify(this.album));
  }

}
