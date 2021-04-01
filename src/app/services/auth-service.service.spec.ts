import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth-service.service';

describe('AuthService', () => {
  let service: AuthService;

  // const firestoreSpy = jasmine.createSpyObj('AngularFirestore', {
  //   });

  // const fireAuthSpy = jasmine.createSpyObj('AngularFireAuth', {
  //   });

  const firestoreStub = {}

  const fireAuthStub = {
    authState:  {
      subscribe: () => Promise.resolve()
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]),],
      providers: [
        { provide: AngularFirestore, useValue: firestoreStub },
        { provide: AngularFireAuth, useValue: fireAuthStub}
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
