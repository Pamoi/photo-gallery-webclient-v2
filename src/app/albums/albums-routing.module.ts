import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { AlbumFormComponent } from './album-form/album-form.component';
import { AlbumSearchListComponent } from './album-search-list/album-search-list.component';

const routes: Routes = [
  { path: '', component: AlbumListComponent },
  { path: 'album/upload', component: AlbumFormComponent },
  { path: 'album/search/:term', component: AlbumSearchListComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'album/:albumId/photo/:photoId', component: PhotoDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule {
}
