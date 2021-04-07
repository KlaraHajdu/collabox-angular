import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import User  from "../types/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    public firestore: AngularFirestore,
    public authentication: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {

    this.authentication.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })

  }

    GoogleAuth() {
      return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
    }

    AuthLogin(provider: any) {
      return this.authentication.signInWithPopup(provider)
      .then((result: { user: any; }) => {
         this.ngZone.run(() => {
            this.router.navigate(['']);
          })
        this.SetUserData(result.user);
      }).catch((error: any) => {
        window.alert(error)
      })
    }

    SetUserData(user: any) {
      const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
      const userData: User = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
      }
      return userRef.set(userData, {
        merge: true
      })
    }

    SignOut() {
      return this.authentication.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
      })
    }

}



