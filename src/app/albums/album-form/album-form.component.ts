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
  }

  onSubmit(): void {
    console.log('Title: ' + this.album.title);
    console.log('Description: ' + this.album.description);
  }

}
