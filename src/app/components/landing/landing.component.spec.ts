import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth-service.service';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  const authServiceStub = {
    SignOut: () => Promise.resolve()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      providers: [{provide: AuthService, useValue: authServiceStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render sidebar', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.sidebar')).toBeTruthy();
  });
  it('should render the right container', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.right-container')).toBeTruthy();
  });
  it('should call signout if logout button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(authServiceStub, 'SignOut')

    compiled.querySelector('[data-testid="logout-button"]').click();

    expect(spy).toHaveBeenCalled();
  });
});
