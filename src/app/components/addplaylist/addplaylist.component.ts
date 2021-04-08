import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { NgRedux } from '@angular-redux/store';
import RootState from '../../store/RootState'


@Component({
  selector: 'addplaylist',
  templateUrl: './addplaylist.component.html',
  styleUrls: ['./addplaylist.component.sass']
})
export class AddPlaylistComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ngRedux: NgRedux<RootState>,
    public router: Router) { }

  ngOnInit(): void {

  }

  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(140)]],
  })

  onSubmit() {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.createPlaylist(this.playlistForm.value.name))
      .then(promise => {
       if (promise.payload !== 'database_error') {
         this.router.navigate([`/playlist/${promise.payload}`]);
       }
    })
  }

}
