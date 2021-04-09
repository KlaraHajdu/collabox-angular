import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import RootState from 'src/app/store/RootState';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import PlaylistData from 'src/app/types/PlaylistData';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import User from 'src/app/types/User';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {

  @select((state: RootState) => state.playlists.ownPlaylists) ownPlaylists$: Observable<Pick<PlaylistData, "id" | "playlistName">[] | null>;
  @select((state: RootState) => state.playlists.otherPlaylists) otherPlaylists$: Observable<PlaylistData[] | null>;
  @select((state: RootState) => state.authentication.currentUser) currentUser$: Observable<User | null>;

  constructor(
    public router: Router,
    private ngRedux: NgRedux<RootState>) { }

  ngOnInit(): void {
    this.currentUser$.subscribe( currentUser => {
      if (currentUser) {
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToOwnPlaylists())
      }
     });
  }

  onClick() {
    this.router.navigate(['/']);
  }

  clickOnPlaylist(id: string) {
    this.router.navigate([`/playlist/${id}`]);
  }

  createPlaylist() {
    this.router.navigate(['/addplaylist']);
  }
}
