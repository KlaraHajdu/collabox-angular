import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
  @select((state:RootState) => state.playlists.currentPlaylist?.songs) songs$: Observable<any[]>;
  playlistId: string;
  toggleInvite: boolean;
  addSongActive: boolean;
  playSongActive: boolean;
  confirmationVisible = false;
  message = "Are you sure you want to delete this playlist?";

  constructor(
    private ngRedux: NgRedux<RootState>,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.playlistId = params.id
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToPlaylist(this.playlistId))
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToSongsCollection(this.playlistId))
      });
  }

  ngOnDestroy(): void {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.unsubscribeFromPlaylist(this.playlistId))
    this.ngRedux.dispatch<any>(playlistsAsyncActions.unsubscribeFromSongsCollection(this.playlistId))
  }

  addSong(){
    this.addSongActive = !this.addSongActive
  }

  startPlayback() {
    this.playSongActive = !this.playSongActive
  }

  startParty() {}

  invite() {
    this.toggleInvite = !this.toggleInvite;
  }

  deletePlaylist() {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.deletePlaylist(this.playlistId))
    this.router.navigate(['/']);
  }

  clickDelete() {
    this.confirmationVisible = true;
  }

  closeConfirmation() {
    this.confirmationVisible = false;
  }

}
