import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPickerComponent } from './photo-picker.component';
import { DragDropDirective } from '../shared/drag-drop.directive';
import { By } from '@angular/platform-browser';
import { Uploader } from '../shared/uploader.class';

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
    component.uploader = new Uploader(null, '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected files', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.addFiles(files);
    fixture.detectChanges();

    expect(component.uploader.items.length).toEqual(1);
    const list = fixture.debugElement.query(By.css('.file-item'));
    expect(list.children.length).toEqual(4);
    expect(list.children[0].nativeElement.innerText).toEqual('photo.jpg');
    expect(list.children[1].nativeElement.innerText).toEqual('0.00 MB');
    expect(list.children[3].nativeElement.innerText).toEqual('Supprimer');
  });

  it('should delete file on button press', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.addFiles(files);
    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css('.file-item'));
    expect(list.children.length).toEqual(4);
    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    btn.nativeElement.click();

    fixture.detectChanges();

    expect(component.uploader.items.length).toEqual(0);
    const list2 = fixture.debugElement.query(By.css('.file-item'));
    expect(list2).toBeNull();
  });

  it('should disable button when upload started', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.addFiles(files);
    component.uploader.hasStarted = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('.btn-danger'));
    expect(btn.nativeElement.disabled).toEqual(true);
  });

  it('should show text when no photo is selected', () => {
    const container = fixture.debugElement.query(By.css('.file-item-container'));
    expect(container.nativeElement.innerText).toEqual('Aucune photo sélectionnée.');
  });

  it('should show text in red when no photo is selected and form is submitted', () => {
    component.submitted = true;
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.error-text'));
    expect(container.nativeElement.innerText).toEqual('Aucune photo sélectionnée.');
  });

  it('should update progress bar during upload', () => {
    const file = new File([''], 'photo.jpg');
    const files: any = [file];

    component.addFiles(files);
    component.uploader.hasStarted = true;
    component.uploader.items[0].progress = 66;
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('.progress-bar'));
    expect(bar.nativeElement.style.width).toEqual('66%');
  });

  it('should filter out files with wrong extension', () => {
    const file = new File([''], 'photo.jpg');
    const file2 = new File([''], 'photo.html');
    const file3 = new File([''], 'photo');
    const files: any = [file, file2, file3];

    component.addFiles(files);
    fixture.detectChanges();

    expect(component.uploader.items.length).toEqual(1);
  });
});
