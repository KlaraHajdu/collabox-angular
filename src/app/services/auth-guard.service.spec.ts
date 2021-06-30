import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth-service.service';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  const authServiceStub = {
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  }

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should navigate to login if not signed in', () => {
    (authServiceStub.isAuthenticated as jasmine.Spy).and.callFake(() => false);
    service.canActivate();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('should return true if signed in', () => {

    (authServiceStub.isAuthenticated as jasmine.Spy).and.callFake(() => true);
    service.canActivate();

    expect(service.canActivate()).toBeTruthy();
  });
});
