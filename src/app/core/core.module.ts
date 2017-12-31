import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfigService } from './shared/app-config.service';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [HttpClientModule],
  providers: [AppConfigService],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent]
})
export class CoreModule {}
