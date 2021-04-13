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
  canChangeSongs: boolean;
  isPlaying: boolean;
  playedSongs: Pick<Song, 'youtubeId' | 'title'>[];
  currentSongForwardIndex: number;
  currentSongBackwardIndex: number;
  canSkipForward: boolean;
  canSkipBackward: boolean;
  isMuted: boolean;

  constructor() {}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.playedSongs = [];
    this.currentSongForwardIndex = 0;
    this.currentSongBackwardIndex = 0;
    this.canChangeSongs = true;
    this.isPlaying = false;
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
    this.canChangeSongs = true;
    this.player.playVideo();
    this.player.mute();
  }

  startPlay() {
    this.player.playVideo();
    this.isPlaying = true;
  }

  onEnd() {
    if (this.currentSong) {
      this.playedSongs = [
        ...this.playedSongs,
        {
          youtubeId: this.currentSong.youtubeId,
          title: this.currentSong.title,
        },
      ];
    }
    this.currentSongForwardIndex += 1;
    this.canChangeSongs = true;
  }

  stopPlay() {
    this.player.stopVideo();
    this.isPlaying = false;
  }

  pausePlay() {
    this.player.pauseVideo();
    this.isPlaying = false;
  }

  changeCurrentSong() {
    if (this.songs$ && this.canChangeSongs) {
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

      this.canChangeSongs = false;
    }
  }
  }

  skipToNext() {

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex < this.songsLength - 1) {
      this.playedSongs = [...this.playedSongs, this.currentSong];
      this.currentSongForwardIndex += 1;

    } else if (this.currentSongBackwardIndex > 0) {
      this.currentSongBackwardIndex -= 1;
    }

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex === this.songsLength - 2) {
        this.canSkipForward = false;
      }

      //
    if (this.currentSongBackwardIndex === 1 && this.currentSongForwardIndex === this.songsLength - 1) {
      this.canSkipForward = false;
    }
      this.canChangeSongs = true;
      this.canSkipBackward = true;
      this.changeCurrentSong();
};

  skipToPrevious = () => {
    if (this.currentSongBackwardIndex < this.playedSongs.length) {
      this.currentSongBackwardIndex += 1 ;
    }
    if (this.currentSongBackwardIndex === this.playedSongs.length - 1) {
      this.canSkipBackward = false;
    }
    this.canSkipForward = true;
    this.canChangeSongs = true;
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
