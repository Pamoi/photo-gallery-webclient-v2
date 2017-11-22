import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlbumListComponent } from './albums/album-list/album-list.component';
import { AlbumDetailComponent } from './albums/album-detail/album-detail.component';

const routes: Routes = [
  { path: '', component: AlbumListComponent },
  { path: 'album/:id', component: AlbumDetailComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
