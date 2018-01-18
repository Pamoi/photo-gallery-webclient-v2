import { Injectable } from '@angular/core';
import { Album } from '../../albums/shared/album.model';

@Injectable()
export class AppStateService {
  public albumList: Album[] = [];
  public listScrollOffset = 0;

  constructor() {
  }
}
