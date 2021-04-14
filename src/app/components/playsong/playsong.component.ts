import { Component, OnInit, ViewChild } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';

@Component({
  selector: 'playsong',
  templateUrl: './playsong.component.html',
  styleUrls: ['./playsong.component.sass'],
})
export class PlaysongComponent implements OnInit {
  @ViewChild('player') player: any;
  @select((state: RootState) => state.playlists.currentPlaylist?.songs) songs$: Observable<any[]>;
  notPlayedSongs$: Observable<any[]>;
  notPlayed: any[];
  songsLength: number;
  currentSong: Pick<Song, 'youtubeId' | 'title'> | undefined;
  playedSongs: Pick<Song, 'youtubeId' | 'title'>[];
  currentSongForwardIndex: number;
  currentSongBackwardIndex: number;
  canSkipForward: boolean;
  canSkipBackward: boolean;
  isMuted: boolean;

  constructor() {}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api?autoplay=1';
    document.body.appendChild(tag);

    this.playedSongs = [];
    this.currentSongForwardIndex = 0;
    this.currentSongBackwardIndex = 0;
    this.canSkipForward = true;
    this.canSkipBackward = false;
    this.isMuted = false;

    this.songs$.subscribe((songs) => {
      this.songsLength = songs.length
      if (this.playedSongs.length === 0) {
        this.currentSong = songs[0];
      }
    });


  }

  onReady(event: any) {
    this.player.playVideo();
    this.player.unMute();
  }

  startPlay() {
    this.player.playVideo();
  }

  onStateChange(event: any) {
    if (event.data === window['YT'].PlayerState.ENDED) {
      this.skipToNext()
    }
  }

  stopPlay() {
    this.player.stopVideo();
  }

  pausePlay() {
    this.player.pauseVideo();
  }

  changeCurrentSong() {
    if (this.songs$ ) {
      if (this.currentSongBackwardIndex > 0) {
        this.currentSong = this.playedSongs[this.playedSongs.length - this.currentSongBackwardIndex];
    } else {
      const playedSongsYoutubeIds = this.playedSongs.map(
        (playedSong: Pick<Song, 'youtubeId' | 'title'>) =>
          playedSong.youtubeId
      );

      this.songs$
          .pipe(map(songs => songs.filter(s => {
            console.log(s)
            return !playedSongsYoutubeIds.includes(s.youtubeId)
          }))).subscribe((res) => {
            console.log(res)
            this.currentSong = res[0]
            })
    }
    setTimeout(() => this.startPlay(), 500)
  }
  }

  skipToNext() {

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex < this.songsLength - 1) {
      this.playedSongs = [...this.playedSongs, this.currentSong];
      this.currentSongForwardIndex += 1;
    } else if (this.currentSongBackwardIndex > 0) {
      this.currentSongBackwardIndex -= 1;
    }

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex === this.songsLength - 1) {
        this.canSkipForward = false;
      }

      this.canSkipBackward = true;
      this.changeCurrentSong();
};

  skipToPrevious = () => {
    if (this.currentSongBackwardIndex < this.playedSongs.length) {
      this.currentSongBackwardIndex += 1 ;
    }
    if (this.currentSongBackwardIndex === this.playedSongs.length) {
      this.canSkipBackward = false;
    }
    this.canSkipForward = true;
    this.changeCurrentSong();
  };

  toggleMute = () => {
    if (!this.isMuted) {
        this.player.mute()
      }
      if (this.isMuted) {
        this.player.unMute()
      }
      this.isMuted = !this.isMuted;
};
}
