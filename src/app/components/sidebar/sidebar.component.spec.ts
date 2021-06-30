import {
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [NgReduxTestingModule, RouterTestingModule.withRoutes([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should navigate to home page', () => {
    const component = fixture.componentInstance;
    const navigateSpy = spyOn(router, 'navigate');

    component.onClick();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
