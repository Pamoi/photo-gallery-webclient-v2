import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFilePreviewComponent } from './photo-file-preview.component';

describe('PhotoFilePreviewComponent', () => {
  let component: PhotoFilePreviewComponent;
  let fixture: ComponentFixture<PhotoFilePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoFilePreviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoFilePreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.maxHeight = 200;
    component.maxWidth = 200;
    component.file = new File([''], 'photo.jpg');

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
