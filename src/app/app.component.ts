import { Component } from '@angular/core';

import { AlbumService } from './albums/shared/album.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AlbumService]
})
export class AppComponent {}
