import { NgRedux, select } from '@angular-redux/store';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import RootState from 'src/app/store/RootState';
import { playlistsAsyncActions } from 'src/app/store/slices/playlists/slice';
import Song from 'src/app/types/Song';

@Component({
  selector: 'party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.sass']
})
export class PartyComponent implements OnInit {
  @ViewChild('player') player: any;
  @Input() isHost: boolean;
  @Input() playlistId: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @select ((state: RootState) => state.playlists.currentPlaylist.partySong) partySong$: Observable<Song>;
  @select ((state: RootState) => state.playlists.currentPlaylist.songs) songs$: Observable<Song[]>
  subscriptions: Subscription;
  playedSongs: Pick<Song, "title" | "youtubeId">[];
  songs: Song[]
  nextSong: Pick<Song, "title" | "youtubeId">;
  isMuted: boolean;
  hasStarted: boolean;

  constructor( private ngRedux: NgRedux<RootState>) { }

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api?autoplay=1';
    tag.id='youtube-player-party';
    document.body.appendChild(tag);

    this.hasStarted = false;

    let subscriptionS;
    if (this.isHost){
      subscriptionS = this.songs$.subscribe(
        songs => {
          console.log("subs")
          this.songs = songs
          console.log(songs)
        if (songs) {
          this.nextSong = this.songs[0];
          this.ngRedux.dispatch<any>(playlistsAsyncActions.updatePartySong({playlistId: this.playlistId, currentSong: this.nextSong}))
        }
      }
        )
      }

    let subscriptionP = this.partySong$.subscribe(
      partySong => {
        if (this.hasStarted && !partySong) {
          console.log("no partySong")
          this.close.emit(null);
        }
        this.hasStarted = true;
      }
    )

    this.subscriptions = new Subscription();
    this.subscriptions.add(subscriptionS);
    this.subscriptions.add(subscriptionP);
    this.playedSongs = [];
    this.isMuted = false;
    console.log(this.nextSong)
  }

  ngOnDestroy():void {
    if (this.isHost) {
      this.subscriptions.unsubscribe();
      this.ngRedux.dispatch<any>(playlistsAsyncActions.endParty(this.playlistId));
    }
    this.close.emit(null);
    var elem = document.querySelector('#youtube-player-party');
    elem.parentNode.removeChild(elem);
  }

  onReady(event: any) {
    this.player.playVideo();
    this.player.unMute();
  }

  onStateChange(event: any) {
    console.log("onstatechange")
    if (event.data === window['YT'].PlayerState.ENDED) {
      console.log("ended")
      this.onEnd();
    }
  }

  onEnd() {
    console.log("onEnd")
    if (this.isHost) {
      this.playedSongs.push(this.nextSong);
      let playedSongsYoutubeIds = this.playedSongs.map(song => song.youtubeId);
      let notPlayedSongs = this.songs.filter(song => !playedSongsYoutubeIds.includes(song.youtubeId))
      console.log(notPlayedSongs)
      if (notPlayedSongs.length > 0) {
        this.nextSong = {youtubeId: notPlayedSongs[0].youtubeId, title: notPlayedSongs[0].title};
        this.ngRedux.dispatch<any>(playlistsAsyncActions.updatePartySong({playlistId: this.playlistId, currentSong: this.nextSong}))
      } else {
        this.ngRedux.dispatch<any>(playlistsAsyncActions.endParty(this.playlistId));
      }
    }
  }

  toggleMute = () => {
    if (!this.isMuted) {
      this.player.mute();
    }
    if (this.isMuted) {
      this.player.unMute();
    }
    this.isMuted = !this.isMuted;
  };

}
