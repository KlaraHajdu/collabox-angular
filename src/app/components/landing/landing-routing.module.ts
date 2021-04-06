import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';
import { AddPlaylistComponent } from '../addplaylist/addplaylist.component';

const routes: Routes = [
  { path: '',
    component: LandingComponent,
    children: [
      { path: 'addplaylist',
        component: AddPlaylistComponent },
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
