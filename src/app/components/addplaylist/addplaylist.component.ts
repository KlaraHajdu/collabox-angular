import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {playlistsActions} from '../../store/slices/playlists/slice';
import {playlistsAsyncActions} from '../../store/slices/playlists/slice';


@Component({
  selector: 'addplaylist',
  templateUrl: './addplaylist.component.html',
  styleUrls: ['./addplaylist.component.sass']
})
export class AddPlaylistComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private _firestoreService: FirestoreService,
    private store: Store<{  }>) { }

  ngOnInit(): void {

  }

  playlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(140)]],
  })

  onSubmit() {

    this._firestoreService.createPlaylist(this.playlistForm.value)

    this.store.dispatch(playlistsAsyncActions.createPlaylist('oebrcbnrec'))
    this.store.dispatch(playlistsActions.SET_OWN_PLAYLISTS([{id:'sbdchbs', playlistName:'jece'}]))

  }

}
