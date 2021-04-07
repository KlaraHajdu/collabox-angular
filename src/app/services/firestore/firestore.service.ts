import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Item { name: string; email: string; id: string }

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;

  constructor(private afs: AngularFirestore) {
    this.itemDoc = afs.doc<Item>('users/4HyALnmW8XVYvJ3FhLdwx1BwMkz2');
    this.item = this.itemDoc.valueChanges();
    console.log(this.item)
   }

  testRead() {

  }
  testCreate() {
    let testObject = {}


  }

}
