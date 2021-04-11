import { Component, Input, OnInit } from '@angular/core';
import Song from 'src/app/types/Song';

@Component({
  selector: 'songlist-item',
  templateUrl: './songlist-item.component.html',
  styleUrls: ['./songlist-item.component.sass']
})
export class SonglistItemComponent implements OnInit {

  @Input() song: Song;

  constructor() { }

  ngOnInit(): void {
  }

}
