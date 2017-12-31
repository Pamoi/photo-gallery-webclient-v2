import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppConfigService {

  constructor() {}

  getBackendUrl(): string {
    return environment.backendUrl;
  }
}
