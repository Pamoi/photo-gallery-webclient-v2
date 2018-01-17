import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfigService } from './shared/app-config.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { ToastComponent } from './toast/toast.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToastService } from './shared/toast.service';
import { AppStateService } from './shared/app-state.service';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  providers: [AppConfigService, AppStateService, ToastService],
  declarations: [SpinnerComponent, ToastComponent],
  exports: [SpinnerComponent, ToastComponent]
})
export class CoreModule {}
