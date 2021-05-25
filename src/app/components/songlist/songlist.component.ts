import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';

@Component({
  selector: 'songlist',
  templateUrl: './songlist.component.html',
  styleUrls: ['./songlist.component.sass']
})
export class SonglistComponent implements OnInit {

  @select((state:RootState) => state.playlists.currentPlaylist?.songs) songs$: Observable<Song[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
