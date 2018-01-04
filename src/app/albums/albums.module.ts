import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { AlbumsRoutingModule } from './albums-routing.module';
import { NgDatepickerModule } from 'ng2-datepicker';

import { AlbumService } from './shared/album.service';
import { PhotoService } from './shared/photo.service';

import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumPreviewComponent } from './album-preview/album-preview.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoComponent } from './photo/photo.component';

import { AuthorListPipe } from './shared/author-list.pipe';
import { FormsModule } from '@angular/forms';
import { AlbumCommentListComponent } from './album-comment-list/album-comment-list.component';
import { AlbumFormComponent } from './album-form/album-form.component';
import { AuthorPickerComponent } from './author-picker/author-picker.component';
import { UserService } from './shared/user.service';

@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumPreviewComponent,
    AlbumDetailComponent,
    PhotoDetailComponent,
    AuthorListPipe,
    PhotoComponent,
    AlbumCommentListComponent,
    AlbumFormComponent,
    AuthorPickerComponent
  ],
  imports: [
    AlbumsRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    NgDatepickerModule
  ],
  providers: [AlbumService, PhotoService, UserService],
})
export class AlbumsModule {
}
