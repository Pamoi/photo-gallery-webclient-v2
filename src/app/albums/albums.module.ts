import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { AlbumsRoutingModule } from './albums-routing.module';

import { AlbumService } from './shared/album.service';

import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumPreviewComponent } from './album-preview/album-preview.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';

import { AuthorListPipe } from './shared/author-list.pipe';

@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumPreviewComponent,
    AlbumDetailComponent,
    AuthorListPipe
  ],
  imports: [
    AlbumsRoutingModule,
    BrowserModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [ AlbumService ],
})
export class AlbumsModule {}
