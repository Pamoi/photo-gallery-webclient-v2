import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Album } from '../shared/album.model';

import { AlbumService } from '../shared/album.service';
import { Photo } from '../shared/photo.model';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})

export class AlbumDetailComponent implements OnInit, AfterViewInit {
  album: Album;

  // Must be equal to the total width (including margins) of an element with the .image-thumbnail css class.
  thumbnailWidth = 202;

  @ViewChild('fullWidthContainer') fullWidthContainer: ElementRef;
  @ViewChild('thumbnailContainer') thumbnailContainer: ElementRef;

  constructor(private route: ActivatedRoute, private albumService: AlbumService) {}

  ngOnInit(): void {
    this.getAlbum();
  }

  ngAfterViewInit(): void {
    this.centerThumbnailContainer();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.centerThumbnailContainer();
  }

  getAlbum(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(album => this.album = album);
  }

  getPhotoUrl(photo: Photo): string {
    return this.albumService.getThumbnailPhotoUrl(photo);
  }

  private centerThumbnailContainer(): void {
    const totalWidth = this.fullWidthContainer.nativeElement.offsetWidth;
    const requiredWidth = totalWidth - (totalWidth % this.thumbnailWidth);
    const margin = (totalWidth - requiredWidth) / 2;

    this.thumbnailContainer.nativeElement.style.width = requiredWidth + 'px';
    this.thumbnailContainer.nativeElement.style.marginLeft = margin + 'px';
  }
}
