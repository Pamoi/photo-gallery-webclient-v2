import { Injectable } from '@angular/core';
import { AppConfigService } from '../../core/shared/app-config.service';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
  }

  getUsers() {
    return this.http.get<User[]>(this.appConfig.getBackendUrl() + '/user/list').pipe(catchError(
      (e: any): Observable<User[]> => {
        throw new Error('Error while fetching users.');
      }
    ));
  }
}
