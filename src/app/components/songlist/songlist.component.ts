import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';
import User from 'src/app/types/User';

@Component({
  selector: 'songlist',
  templateUrl: './songlist.component.html',
  styleUrls: ['./songlist.component.sass']
})
export class SonglistComponent implements OnInit {

  @select((state:RootState) => state.playlists.currentPlaylist?.songs) songs$: Observable<Song[]>;
  @select((state: RootState) => state.playlists.currentPlaylist.owner) owner$: Observable<string>;
  @select((state: RootState) => state.playlists.currentPlaylist.lockStatus) lockStatus$: Observable<boolean>;
  @select((state: RootState) => state.authentication.currentUser) currentUser$: Observable<User>;
  canDelete: boolean;
  ownPlaylist: boolean;
  subscriptions: Subscription;

  constructor() { }

  ngOnInit(): void {



    let subscriptionO$

    let subscriptionU$ = this.currentUser$.subscribe(
      user => {
        if (user) {
          subscriptionO$ = this.owner$.subscribe(owner => {
            if (user.id === owner){
              this.ownPlaylist = true;
            } else {
              this.ownPlaylist = false;
            }
          })
        }
    })

    let subscriptionL$ = this.lockStatus$.subscribe(
      lockStatus => {
        if (this.ownPlaylist) {
          this.canDelete = true;
        } else if (!lockStatus) {
          this.canDelete = true;
        } else {
          this.canDelete = false;
        }
      }
    )

    this.subscriptions = new Subscription();
    this.subscriptions.add(subscriptionU$);
    this.subscriptions.add(subscriptionL$);
    this.subscriptions.add(subscriptionO$);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
