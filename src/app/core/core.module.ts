import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfigService } from './app-config.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [AppConfigService]
})
export class CoreModule {}
