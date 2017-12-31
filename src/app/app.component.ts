import { Component } from '@angular/core';

import { AlbumService } from './albums/shared/album.service';
import { AuthService } from './authentication/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  constructor(public auth: AuthService) {
  }
}
