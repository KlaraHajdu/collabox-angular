import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { playlistsAsyncActions } from '../../store/slices/playlists/slice';
import { NgRedux } from '@angular-redux/store';
import RootState from '../../store/RootState'

@Component({
  selector: 'addsong',
  templateUrl: './addsong.component.html',
  styleUrls: ['./addsong.component.sass']
})
export class AddsongComponent implements OnInit {

  constructor(    private fb: FormBuilder,
    private ngRedux: NgRedux<RootState>,
    public router: Router) { }

  ngOnInit(): void {
  }

  addsongForm = this.fb.group({
    url: ['', [Validators.required, Validators.maxLength(140)]],
  })

  onSubmit() {
    this.ngRedux.dispatch<any>(playlistsAsyncActions.verifyUrl(this.addsongForm.value.url))
  }

}
