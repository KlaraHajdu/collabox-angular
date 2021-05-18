import { NgRedux, select } from '@angular-redux/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import RootState from 'src/app/store/RootState';
import { playlistsAsyncActions } from 'src/app/store/slices/playlists/slice';

@Component({
  selector: 'edit-title',
  templateUrl: './edit-title.component.html',
  styleUrls: ['./edit-title.component.sass'],
})
export class EditTitleComponent implements OnInit {
  @Input() title: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @select((state: RootState) => state.playlists.currentPlaylist.id) playlistId$: Observable<string>
  playlistId: string;

  constructor(private fb: FormBuilder, private ngRedux: NgRedux<RootState>) {}

  ngOnInit(): void {
    this.playlistId$.subscribe(
      playlistId => this.playlistId = playlistId
    )
  }

  titleForm = this.fb.group({
    newTitle: ['', [Validators.required, Validators.maxLength(30)]],
  });

  onSubmit() {
    this.ngRedux.dispatch<any>(
      playlistsAsyncActions.changePlaylistTitle({newTitle: this.titleForm.value.newTitle, playlistId: this.playlistId})
    );
    this.close.emit(null);
  }

  clickCancel() {
    this.close.emit(null);
  }
}
