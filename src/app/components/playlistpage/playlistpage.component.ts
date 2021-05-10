import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgRedux, select } from '@angular-redux/store';
import RootState from '../../store/RootState';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { Observable, Subscription } from 'rxjs';
import User from 'src/app/types/User';
import ActionType from 'src/app/types/ActionType';


@Component({
  selector: 'app-playlistpage',
  templateUrl: './playlistpage.component.html',
  styleUrls: ['./playlistpage.component.sass']
})
export class PlaylistPageComponent implements OnInit {

  @select((state:RootState) => state.playlists.currentPlaylist?.playlistName) title$: Observable<string>;
  @select((state:RootState) => state.playlists.currentPlaylist?.owner) owner$: Observable<string>;
  @select((state:RootState) => state.playlists.currentPlaylist?.ownerName) ownerName$: Observable<string>;
  @select((state:RootState) => state.playlists.currentPlaylist?.songs) songs$: Observable<any[]>;
  @select((state:RootState) => state.authentication.currentUser) currentUser$: Observable<User>;
  subscriptions: Subscription
  playlistId: string;
  mounted: boolean;
  ownPlaylist: boolean;
  toggleInvite: boolean;
  addSongActive: boolean;
  playSongActive: boolean;
  confirmationVisible = false;
  message: string;
  actionType: ActionType;

  constructor(
    private ngRedux: NgRedux<RootState>,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    let subscriptionP$ = this.activatedRoute.params.subscribe(
      params => {
        this.playlistId = params.id
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToPlaylist(this.playlistId))
        this.ngRedux.dispatch<any>(playlistsAsyncActions.subscribeToSongsCollection(this.playlistId))
      });

      let subscriptionU$ = this.currentUser$.subscribe(
      user => {
        if (user) {
          this.owner$.subscribe(owner => {
            if (user.id === owner) {
              this.ownPlaylist = true;
            } else {
              this.ownPlaylist = false;
            }
          })
        }
    })

    let subscriptionT$ = this.title$.subscribe(
      title => {
        if (title === undefined && this.mounted) {
          this.router.navigate(['/'])
        }
      }
    )
    this.subscriptions = new Subscription();
    this.subscriptions.add(subscriptionT$)
    this.subscriptions.add(subscriptionU$)
    this.subscriptions.add(subscriptionP$)
    this.mounted = true;
  }



  ngOnDestroy(): void {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.unsubscribeFromPlaylist(this.playlistId))
    this.ngRedux.dispatch<any>(playlistsAsyncActions.unsubscribeFromSongsCollection(this.playlistId))
    this.subscriptions.unsubscribe()
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

  confirmAction() {
    switch (this.actionType) {
      case ActionType.Delete:
        this.ngRedux.dispatch<any>(playlistsAsyncActions.deletePlaylist(this.playlistId))
        this.router.navigate(['/']);
        break;
      case ActionType.Unfollow:
        this.ngRedux.dispatch<any>(playlistsAsyncActions.unfollowPlaylist(this.playlistId))
        this.router.navigate(['/']);
        break;
    }
  }

  clickDelete() {
    this.message = "Are you sure you want to delete this playlist?";
    this.actionType = ActionType.Delete
    this.confirmationVisible = true;
  }

  clickUnfollow() {
    this.message= "Are you sure you want to unfollow this playlist?"
    this.actionType = ActionType.Unfollow
    this.confirmationVisible = true;
  }

  closeConfirmation() {
    this.confirmationVisible = false;
  }
}
