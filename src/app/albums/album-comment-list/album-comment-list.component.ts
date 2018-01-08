import { Component, Input } from '@angular/core';
import { AlbumService } from '../shared/album.service';
import { Album } from '../shared/album.model';
import { AuthService } from '../../authentication/shared/auth.service';
import { Comment } from '../shared/comment.model';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';

@Component({
  selector: 'app-album-comment-list',
  templateUrl: './album-comment-list.component.html',
  styleUrls: ['./album-comment-list.component.scss']
})
export class AlbumCommentListComponent {
  @Input() album: Album;

  commentText: string;

  constructor(private albumService: AlbumService, private auth: AuthService, private toastService: ToastService) {
  }

  canComment(): boolean {
    return this.auth.isLoggedIn;
  }

  getPlaceholder(): string {
    if (this.auth.isLoggedIn) {
      return 'Ajouter un commentaire...';
    } else {
      return 'Connectez vous pour ajouter un commentaire.';
    }
  }

  sendComment(): void {
    if (this.album && this.commentText.length > 0) {
      this.albumService.commentAlbum(this.album.id, this.commentText).subscribe(album => {
        this.album = album;
        this.commentText = '';
      }, () => {
        this.toastService.toast(
          'Une erreur est survenue lors de l\'envoi du commentaire.', ToastType.Danger, ToastDuration.Medium);
      });
    }
  }

  canDelete(comment: Comment): boolean {
    if (!this.auth.isLoggedIn) {
      return false;
    }

    return comment.author.id === this.auth.getUserId();
  }

  deleteComment(comment: Comment): void {
    this.albumService.deleteComment(this.album.id, comment.id).subscribe(() => {
      const index = this.album.comments.indexOf(comment);
      if (index >= 0) {
        this.album.comments.splice(index, 1);
      }
    }, () => {
      this.toastService.toast(
        'Une erreur est survenue lors de la suppression du commentaire.', ToastType.Danger, ToastDuration.Medium);
    });
  }
}
