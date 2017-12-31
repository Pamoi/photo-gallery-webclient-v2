import { Component, Input } from '@angular/core';
import { AlbumService } from '../shared/album.service';
import { Album } from '../shared/album.model';
import { AuthService } from '../../authentication/shared/auth.service';
import { Comment } from '../shared/comment.model';

@Component({
  selector: 'app-album-comment-list',
  templateUrl: './album-comment-list.component.html',
  styleUrls: ['./album-comment-list.component.scss']
})
export class AlbumCommentListComponent {
  @Input() album: Album;

  commentText: string;

  constructor(private albumService: AlbumService, private auth: AuthService) {
  }

  sendComment(): void {
    if (this.album && this.commentText.length > 0) {
      this.albumService.commentAlbum(this.album.id, this.commentText).subscribe(album => {
        this.album = album;
        this.commentText = '';
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
      this.album.comments.splice(index, 1);
    });
  }
}
