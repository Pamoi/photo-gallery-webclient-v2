import { DragDropDirective } from './drag-drop.directive';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div appDragDrop (onFilesAdded)="addFiles($event)" id="test"></div>'
})
class TestDragDropComponent {
  files: FileList;

  addFiles(files: FileList) {
    this.files = files;
  }
}

describe('DragDropDirective', () => {

  const mockFiles = [new File([''], 'photo.jpg')];

  const mockDragOverEvent = {
    dataTransfer: { files: mockFiles }
  };

  let fixture: ComponentFixture<TestDragDropComponent>;
  let component: TestDragDropComponent;
  let div: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDragDropComponent, DragDropDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDragDropComponent);
    component = fixture.componentInstance;
    div = fixture.debugElement.query(By.css('#test'));
  });

  it('should create an instance', () => {
    const directive = new DragDropDirective();
    expect(directive).toBeTruthy();
  });

  it('should set class name on drag over', async(() => {
    fixture.detectChanges();

    expect(div.nativeElement.className).toEqual('dropzone');

    div.nativeElement.dispatchEvent(new Event('dragover'));
    fixture.detectChanges();

    expect(div.nativeElement.className).toEqual('dropzone-over');

    div.nativeElement.dispatchEvent(new Event('dragleave'));
    fixture.detectChanges();

    expect(div.nativeElement.className).toEqual('dropzone');
  }));
});
