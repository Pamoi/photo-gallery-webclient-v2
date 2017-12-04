import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * The appHttpSrc directive uses the http client to get an image to allow the authentication
 * header to be set by interceptors. It should only be used on <img> elements.
 */
@Directive({
  selector: '[appHttpSrc]'
})
export class HttpSrcDirective implements OnDestroy {
  private src: string;
  private objectURL: string;

  constructor(private el: ElementRef, private http: HttpClient) { }

  @Input()
  public set appHttpSrc(val: string) {
    if (val !== this.src) {
      this.src = val;
      this.revokeObjectURL();
      this.getImage();
    }
  }

  ngOnDestroy(): void {
    this.revokeObjectURL();
  }

  private getImage(): void {
    this.http.get(this.src, {responseType: 'blob'}).subscribe(blob => this.displayImage(blob));
  }

  private displayImage(blob: Blob) {
    this.el.nativeElement.src = URL.createObjectURL(blob);
  }

  private revokeObjectURL(): void {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
    }
  }
}
