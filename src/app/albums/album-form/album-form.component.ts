import { Component, OnInit } from '@angular/core';
import { Album } from '../shared/album.model';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.scss']
})
export class AlbumFormComponent implements OnInit {
  album: Album;

  constructor() {}

  ngOnInit() {
    this.album = new Album();
    this.album.authors = [];
  }

  onSubmit(): void {
    console.log(JSON.stringify(this.album));
  }

}
