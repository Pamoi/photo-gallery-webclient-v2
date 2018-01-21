import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AlbumService } from './album.service';
import { catchError } from 'rxjs/operators';
import { ToastDuration, ToastService, ToastType } from '../../core/shared/toast.service';


@Injectable()
export class RandomAlbumResolver implements Resolve<void> {
  constructor(private albumService: AlbumService, private router: Router, private toast: ToastService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return this.albumService.getRandomAlbum().take(1).map(album => {
      this.router.navigateByUrl('/album/' + album.id);
      return null;
    }).pipe(
      catchError((error: Error) => {
        this.toast.toast('Une erreur est survenue lors du chargement d\'un album aléatoire',
          ToastType.Danger, ToastDuration.Medium);
        return [];
      })
    );
  }
}
