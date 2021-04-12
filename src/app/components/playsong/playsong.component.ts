import { Component, OnInit, ViewChild } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';

@Component({
  selector: 'playsong',
  templateUrl: './playsong.component.html',
  styleUrls: ['./playsong.component.sass'],
})
export class PlaysongComponent implements OnInit {
  @ViewChild('player') player: any;
  @select((state: RootState) => state.playlists.currentPlaylist?.songs)
  songs$: Observable<any[]>;
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
      if (songs && this.canChangeSongs) {
        const playedSongsYoutubeIds = this.playedSongs.map(
          (playedSong: Pick<Song, 'youtubeId' | 'title'>) =>
            playedSong.youtubeId
        );
        const notPlayedSongs = songs.filter(
          (song: Song) => !playedSongsYoutubeIds.includes(song.youtubeId)
        );
        console.log(notPlayedSongs)
        this.currentSong = notPlayedSongs[0];
        this.canChangeSongs = false;
      }
    });
  }

  onReady(event: any) {
    this.canChangeSongs = true;
    this.player.playVideo();
    this.player.unMute();
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


  skipToNext() {
    if (!this.currentSong) {
        return;
    }
    this.canSkipBackward = true;

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex < this.songsLength - 1) {
        this.playedSongs = [...this.playedSongs, this.currentSong];
        this.currentSongForwardIndex = this.currentSongForwardIndex + 1;
    } else if (this.currentSongBackwardIndex > 0) {
        this.currentSongBackwardIndex = this.currentSongBackwardIndex - 1;
    }

    if (this.currentSongBackwardIndex === 0 && this.currentSongForwardIndex === this.songsLength - 2) {
        this.canSkipForward = false;
    }

    if (this.currentSongBackwardIndex === 1 && this.currentSongForwardIndex === this.songsLength - 1) {
        this.canSkipForward = false;
    }
    this.canChangeSongs = true;
};

  skipToPrevious = () => {
    this.canSkipForward = true;
    if (this.currentSongBackwardIndex < this.playedSongs.length) {
        this.currentSongBackwardIndex += 1 ;
    }
    if (this.currentSongBackwardIndex === this.playedSongs.length - 1) {
        this.canSkipBackward = false;
    }
    this.canChangeSongs = true;
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
