import { Pipe, PipeTransform } from '@angular/core';

import {User} from './user.model';

@Pipe({name: 'authorList'})
export class AuthorListPipe implements PipeTransform {
  transform(value: User[]): string {
    if (!value) {
      return '';
    }

    return value.map(e => e.username).join(', ');
  }
}