import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  term = '';

  constructor(private router: Router) {
  }

  onSubmit(): void {
    if (this.term.length > 0) {
      this.router.navigateByUrl('/album/search/' + this.term);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
