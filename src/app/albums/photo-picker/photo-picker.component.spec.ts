import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPickerComponent } from './photo-picker.component';
import { DragDropDirective } from '../shared/drag-drop.directive';
import { By } from '@angular/platform-browser';

describe('PhotoPickerComponent', () => {
  let component: PhotoPickerComponent;
  let fixture: ComponentFixture<PhotoPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoPickerComponent, DragDropDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected files', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.files = [];
    component.addFiles(files);
    fixture.detectChanges();

    expect(component.files).toEqual(files);
    const list = fixture.debugElement.query(By.css('.file-item'));
    expect(list.children.length).toEqual(3);
    expect(list.children[0].nativeElement.innerText).toEqual('photo.jpg');
    expect(list.children[1].nativeElement.innerText).toEqual('0.00 MB');
  });

  it('should delete file on button press', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.files = [];
    component.addFiles(files);
    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css('.file-item'));
    expect(list.children.length).toEqual(3);
    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    btn.nativeElement.click();

    fixture.detectChanges();

    expect(component.files.length).toEqual(0);
  });
});
