import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import RootState from 'src/app/store/RootState';
import { playlistsAsyncActions } from 'src/app/store/slices/playlists/slice';

@Component({
  selector: 'follow-playlist',
  templateUrl: './follow-playlist.component.html',
  styleUrls: ['./follow-playlist.component.sass']
})
export class FollowPlaylistComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ngRedux: NgRedux<RootState>,
    public router: Router) { }

  ngOnInit(): void {
  }

  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
  })

  onSubmit() {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.followPlaylist(this.playlistForm.value.name))
      .then(promise => {
       if (promise.payload !== 'database_error') {
         this.router.navigate([`/playlist/${promise.payload}`]);
       }
    })
  }

}
