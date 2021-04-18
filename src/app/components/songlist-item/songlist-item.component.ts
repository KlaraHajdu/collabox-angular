import { NgRedux } from '@angular-redux/store';
import { Component, Input, OnInit } from '@angular/core';
import RootState from 'src/app/store/RootState';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import Song from 'src/app/types/Song';
import VoteType from 'src/app/types/VoteType';
import PlaylistType from 'src/app/types/PlaylistType';

@Component({
  selector: 'songlist-item',
  templateUrl: './songlist-item.component.html',
  styleUrls: ['./songlist-item.component.sass'],
})
export class SonglistItemComponent implements OnInit {
  @Input() song: Song;
  message: string;
  confirmationVisible: boolean

  constructor(private ngRedux: NgRedux<RootState>) {}

  ngOnInit(): void {
    this.message = "Are you sure you want to delete this song?"
  }

  upVote() {
    this.ngRedux.dispatch<any>(
      playlistsAsyncActions.vote({
        songId: this.song.id,
        voteType: VoteType.upVote,
        playlistType: PlaylistType.ownPlaylist,
      })
    );
  }

  downVote() {
    this.ngRedux.dispatch<any>(
      playlistsAsyncActions.vote({
        songId: this.song.id,
        voteType: VoteType.downVote,
        playlistType: PlaylistType.ownPlaylist,
      })
    );
  }

  deleteSong() {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.deleteSong(this.song.id));
  }

  deleteClick() {
    this.confirmationVisible = true;
  }

  closeConfirmation() {
    this.confirmationVisible = false;
  }
}
