import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgRedux, select } from '@angular-redux/store';
import RootState from '../../store/RootState';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-playlistpage',
  templateUrl: './playlistpage.component.html',
  styleUrls: ['./playlistpage.component.sass']
})
export class PlaylistPageComponent implements OnInit {

  @select((state:RootState) => state.playlists.currentPlaylist?.playlistName) title$: Observable<string>;
  playlistId: string;
  toggleInvite: boolean;
  addSongActive: boolean;

  constructor(
    private ngRedux: NgRedux<RootState>,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.playlistId = params.id
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToPlaylist(this.playlistId))
        this.toggleInvite = false;
      });
  }

  ngOnDestroy(): void {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.unsubscribeFromPlaylist(this.playlistId))
  }

  addSong(){
    this.addSongActive = !this.addSongActive
  }

  startPlayback() {}

  startParty() {}

  invite() {
    this.toggleInvite = !this.toggleInvite;
  }

  deletePlaylist() {}

}
