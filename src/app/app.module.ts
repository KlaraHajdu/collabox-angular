import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

import store from './store/index';
import { AngularMaterialModule } from './angular-material.module';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { AddPlaylistComponent } from './components/addplaylist/addplaylist.component';
import { AuthService } from './services/auth-service.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import RootState from './store/RootState';
import { PlaylistPageComponent } from './components/playlistpage/playlistpage.component';
import { AddsongComponent } from './components/addsong/addsong.component';
import { SonglistComponent } from './components/songlist/songlist.component';
import { SonglistItemComponent } from './components/songlist-item/songlist-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    SidebarComponent,
    AddPlaylistComponent,
    PlaylistPageComponent,
    AddsongComponent,
    SonglistComponent,
    SonglistItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    NgReduxModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(ngRedux: NgRedux<RootState>) {
    ngRedux.provideStore(store);
  }
 }
