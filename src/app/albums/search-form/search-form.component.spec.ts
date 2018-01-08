import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [SearchFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to search url on form submit', () => {
    const spy = spyOn(router, 'navigateByUrl');

    component.term = 'some album';

    const btn = fixture.debugElement.query(By.css('.btn'));
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith('/album/search/some album');
  });

  it('should redirect to home url on empty form submit', () => {
    const spy = spyOn(router, 'navigateByUrl');

    const btn = fixture.debugElement.query(By.css('.btn'));
    btn.nativeElement.click();

    expect(spy).toHaveBeenCalledWith('/');
  });
});
