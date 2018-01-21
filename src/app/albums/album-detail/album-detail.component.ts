import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Album } from '../shared/album.model';

import { AlbumService } from '../shared/album.service';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';
import { AuthService } from '../../authentication/shared/auth.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})

export class AlbumDetailComponent implements OnInit, AfterViewInit {
  albumId: number;
  album: Album;
  loading = false;
  loadingError = false;
  suppressing = false;

  // Must be equal to the total width (including margins) of thumbnail element.
  thumbnailWidth = 202;

  @ViewChild('fullWidthContainer') fullWidthContainer: ElementRef;
  @ViewChild('thumbnailContainer') thumbnailContainer: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('cancelBtn') cancelBtn: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private albumService: AlbumService,
              private toast: ToastService, private auth: AuthService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.albumId = +params['id'];
      this.getAlbum();
    });
  }

  ngAfterViewInit(): void {
    this.centerThumbnailContainer();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.centerThumbnailContainer();
  }

  isUserAuthor(): boolean {
    if (this.album && this.auth.isLoggedIn) {
      if (this.auth.isAdmin()) {
        return true;
      }

      return this.album.authors.filter(u => u.id === this.auth.getUserId()).length > 0;
    }

    return false;
  }

  getAlbum(): void {
    if (!this.albumId) {
      return;
    }

    this.album = null;
    this.loading = true;
    this.loadingError = false;

    this.albumService.getAlbum(this.albumId).subscribe(album => {
      this.album = album;
      this.loading = false;
    }, () => {
      this.loading = false;
      this.loadingError = true;
    });
  }

  deleteAlbum(): void {
    this.suppressing = true;

    this.albumService.deleteAlbum(this.album.id).subscribe(() => {
      this.suppressing = false;
      this.cancelBtn.nativeElement.click();

      this.toast.toast('Album supprimé.', ToastType.Success, ToastDuration.Medium);
      this.router.navigateByUrl('/');
    }, () => {
      this.suppressing = false;
      this.cancelBtn.nativeElement.click();

      this.toast.toast('Erreur lors de la suppression de l\'album', ToastType.Danger, ToastDuration.Medium);
    });
  }

  downloadAlbum(): void {
    if (this.album && this.album.photos.length > 0) {
      this.albumService.getAlbumDownloadUrl(this.album.id).subscribe(url => {
        this.downloadLink.nativeElement.href = url;
        this.downloadLink.nativeElement.click();
      }, () => {
        this.toast.toast('Une erreur est survenue lors du téléchargement de l\'album',
          ToastType.Danger, ToastDuration.Medium);
      });
    }
  }

  private centerThumbnailContainer(): void {
    const totalWidth = this.fullWidthContainer.nativeElement.offsetWidth;
    const requiredWidth = totalWidth - (totalWidth % this.thumbnailWidth);
    const margin = (totalWidth - requiredWidth) / 2;

    this.thumbnailContainer.nativeElement.style.width = requiredWidth + 'px';
    this.thumbnailContainer.nativeElement.style.marginLeft = margin + 'px';
  }
}
