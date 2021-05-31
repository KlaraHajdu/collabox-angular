import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AddPlaylistComponent } from './components/addplaylist/addplaylist.component';
import { PlaylistPageComponent } from './components/playlistpage/playlistpage.component';
import { FollowPlaylistComponent } from './components/follow-playlist/follow-playlist.component';
import { IntroductionComponent } from './components/introduction/introduction.component';

const routes: Routes = [
  { path: '',
    component: LandingComponent,
    canActivate: [AuthGuardService],
    children: [
      {path:'addplaylist',
      component: AddPlaylistComponent},
      {path:'playlist/:id',
      component: PlaylistPageComponent},
      {path:'follow',
      component: FollowPlaylistComponent},
      {path:'',
      component: IntroductionComponent}
    ]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
