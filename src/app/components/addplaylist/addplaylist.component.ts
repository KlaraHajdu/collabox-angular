import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Observable } from 'rxjs';
import * as playlistsSlice from '../../store/slices/playlists/slice';
// import { playlistsActions } from '../../store/slices/playlists/slice';
// import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import RootState from '../../store/RootState'


@Component({
  selector: 'addplaylist',
  templateUrl: './addplaylist.component.html',
  styleUrls: ['./addplaylist.component.sass']
})
export class AddPlaylistComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _firestoreService: FirestoreService,
    private ngRedux: NgRedux<RootState>) { }

  ngOnInit(): void {

  }

  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(140)]],
  })

  onSubmit() {

    // this._firestoreService.createPlaylist(this.playlistForm.value)

    this.ngRedux.dispatch<any>(playlistsSlice.playlistsAsyncActions.createPlaylist("ebcberce"))


  }

}
