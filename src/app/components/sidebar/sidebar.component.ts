import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {

  onClick() {
    this.router.navigate(['/']);
  }

  createPlaylist() {
    this.router.navigate(['/addplaylist']);
  }

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
