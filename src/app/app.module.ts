import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgReduxModule, NgRedux } from '@angular-redux/store';

// import playlistReducer from './store/slices/playlists/slice';
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

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    SidebarComponent,
    AddPlaylistComponent
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
