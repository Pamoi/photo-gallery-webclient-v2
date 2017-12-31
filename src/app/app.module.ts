import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AlbumsModule } from './albums/albums.module';

import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthenticationModule,
    AlbumsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
