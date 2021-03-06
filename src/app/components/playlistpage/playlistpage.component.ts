import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import RootState from '../../store/RootState';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { Observable, Subscription } from 'rxjs';
import User from 'src/app/types/User';
import ActionType from 'src/app/types/ActionType';
import Song from 'src/app/types/Song';

@Component({
  selector: 'app-playlistpage',
  templateUrl: './playlistpage.component.html',
  styleUrls: ['./playlistpage.component.sass'],
})
export class PlaylistPageComponent implements OnInit {
  @select((state: RootState) => state.playlists.currentPlaylist?.playlistName)
  title$: Observable<string>;
  @select((state: RootState) => state.playlists.currentPlaylist?.lockStatus)
  lockStatus$: Observable<boolean>;
  @select((state: RootState) => state.playlists.currentPlaylist?.owner)
  owner$: Observable<string>;
  @select((state: RootState) => state.playlists.currentPlaylist?.ownerName)
  ownerName$: Observable<string>;
  @select((state: RootState) => state.playlists.currentPlaylist?.songs)
  songs$: Observable<Song[]>;
  @select((state: RootState) => state.playlists.currentPlaylist?.partySong)
  partySong$: Observable<{
    youtubeId: string;
    title: string;
    startTime: string;
  }>;
  @select((state: RootState) => state.authentication.currentUser)
  currentUser$: Observable<User>;
  subscriptions: Subscription;
  playlistId: string;
  locked: boolean;
  mounted: boolean;
  ownPlaylist: boolean;
  toggleInvite: boolean;
  addSongActive: boolean;
  playSongActive: boolean;
  partyActive: boolean;
  editTitleActive: boolean;
  confirmationVisible = false;
  message: string;
  info: string;
  actionType: ActionType;

  constructor(
    private ngRedux: NgRedux<RootState>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let subscriptionP$ = this.activatedRoute.params.subscribe((params) => {
      this.playlistId = params.id;
      this.ngRedux.dispatch<any>(
        playlistsAsyncActions.subscribeToPlaylist(this.playlistId)
      );
      this.ngRedux.dispatch<any>(
        playlistsAsyncActions.subscribeToSongsCollection(this.playlistId)
      );
      this.playSongActive = false;
      this.partyActive = false;
    });

    let subscriptionO$;
    let subscriptionPS$;
    let subscriptionU$ = this.currentUser$.subscribe((user) => {
      if (user) {
        subscriptionO$ = this.owner$.subscribe((owner) => {
          if (user.id === owner) {
            this.ownPlaylist = true;
          } else {
            this.ownPlaylist = false;
          }
        });
        subscriptionPS$ = this.partySong$.subscribe(
          (partySong) => {
          if (!!partySong  && this.ownPlaylist && (this.partyActive === false)) {
            this.ngRedux.dispatch<any>(playlistsAsyncActions.endParty(this.playlistId));
          }
        })
      }
    });

    let subscriptionT$ = this.title$.subscribe((title) => {
      if (title === undefined && this.mounted) {
        this.router.navigate(['/']);
      }
    });

    let subscriptionL$ = this.lockStatus$.subscribe((lockStatus) => {
      this.locked = lockStatus;
    });



    this.subscriptions = new Subscription();
    this.subscriptions.add(subscriptionT$);
    this.subscriptions.add(subscriptionU$);
    this.subscriptions.add(subscriptionP$);
    this.subscriptions.add(subscriptionL$);
    this.subscriptions.add(subscriptionPS$);
    this.mounted = true;
  }

  ngOnDestroy(): void {
    this.ngRedux.dispatch<any>(
      playlistsAsyncActions.unsubscribeFromPlaylist(this.playlistId)
    );
    this.ngRedux.dispatch<any>(
      playlistsAsyncActions.unsubscribeFromSongsCollection(this.playlistId)
    );
    this.subscriptions.unsubscribe();
  }

  addSong() {
    this.addSongActive = !this.addSongActive;
  }

  startPlayback() {
    this.playSongActive = !this.playSongActive;
    if (this.partyActive) {
      this.partyActive = false;
    }
  }

  startParty() {
    this.partyActive = !this.partyActive;
    if (this.playSongActive) {
      this.playSongActive = false;
    }
  }

  closeParty() {
    this.partyActive = false;
  }

  invite() {
    this.toggleInvite = !this.toggleInvite;
  }

  confirmAction() {
    switch (this.actionType) {
      case ActionType.Delete:
        this.ngRedux.dispatch<any>(
          playlistsAsyncActions.deletePlaylist(this.playlistId)
        );
        this.router.navigate(['/']);
        break;
      case ActionType.Unfollow:
        this.ngRedux.dispatch<any>(
          playlistsAsyncActions.unfollowPlaylist(this.playlistId)
        );
        this.router.navigate(['/']);
        break;
      case ActionType.ToggleLock:
        this.ngRedux.dispatch<any>(
          playlistsAsyncActions.toggleLockStatus({
            playlistId: this.playlistId,
            newLockStatus: !this.locked,
          })
        );
        this.confirmationVisible = false;
        this.message = '';
        this.info = '';
        break;
    }
  }

  clickDelete() {
    this.message = 'Are you sure you want to delete this playlist?';
    this.actionType = ActionType.Delete;
    this.confirmationVisible = true;
  }

  clickUnfollow() {
    this.message = 'Are you sure you want to unfollow this playlist?';
    this.actionType = ActionType.Unfollow;
    this.confirmationVisible = true;
  }

  closeConfirmation() {
    this.confirmationVisible = false;
  }

  editTitle() {
    this.editTitleActive = true;
  }

  closeEditTitle() {
    this.editTitleActive = false;
  }

  clickToggleLockStatus() {
    this.message = `${
      this.locked
        ? 'Are you sure you want to unlock this playlist?'
        : 'Are you sure you want to lock this playlist?'
    }
    `;
    this.info = `${
      this.locked
        ? 'Followers can add or remove songs from unlocked playlists.'
        : ' Followers cannot add or remove songs from locked playlists. They can still upvote and downvote songs.'
    }`;
    this.actionType = ActionType.ToggleLock;
    this.confirmationVisible = true;
  }
}
