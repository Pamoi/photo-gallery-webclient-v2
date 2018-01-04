import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumFormComponent } from './album-form.component';
import { FormsModule } from '@angular/forms';

describe('AlbumFormComponent', () => {
  let component: AlbumFormComponent;
  let fixture: ComponentFixture<AlbumFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AlbumFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
