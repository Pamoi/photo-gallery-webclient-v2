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
import { PhotoPickerComponent } from './photo-picker/photo-picker.component';
import { DragDropDirective } from './shared/drag-drop.directive';
import { SearchFormComponent } from './search-form/search-form.component';
import { AlbumSearchListComponent } from './album-search-list/album-search-list.component';
import { PhotoFilePreviewComponent } from './photo-file-preview/photo-file-preview.component';
import { PhotoCoverComponent } from './photo-cover/photo-cover.component';
import { PhotoThumbnailComponent } from './photo-thumbnail/photo-thumbnail.component';
import { PhotoSideMenuComponent } from './photo-side-menu/photo-side-menu.component';

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
    AuthorPickerComponent,
    PhotoPickerComponent,
    DragDropDirective,
    SearchFormComponent,
    AlbumSearchListComponent,
    PhotoFilePreviewComponent,
    PhotoCoverComponent,
    PhotoThumbnailComponent,
    PhotoSideMenuComponent,
  ],
  imports: [
    AlbumsRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    NgDatepickerModule
  ],
  exports: [
    SearchFormComponent
  ],
  providers: [AlbumService, PhotoService, UserService]
})
export class AlbumsModule {
}
