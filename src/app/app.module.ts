import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AlbumService } from './albums/shared/album.service';

import { AppComponent } from './app.component';
import { AlbumListComponent } from './albums/album-list/album-list.component';
import { AlbumPreviewComponent } from './albums/album-preview/album-preview.component';
import { AlbumDetailComponent } from './albums/album-detail/album-detail.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    AlbumPreviewComponent,
    AlbumDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ AlbumService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
