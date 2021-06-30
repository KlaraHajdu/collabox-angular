import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authenticationServiceStub = {
    GoogleAuth: () => Promise.resolve()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [{provide: AuthService, useValue: authenticationServiceStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the title', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.title').textContent).toContain('COLLABOX');
  });
  it('should call login if login button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(authenticationServiceStub, 'GoogleAuth')

    compiled.querySelector('button').click();

    expect(spy).toHaveBeenCalled();
  });
});
