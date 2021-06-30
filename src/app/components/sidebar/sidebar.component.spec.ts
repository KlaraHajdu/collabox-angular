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
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [NgReduxTestingModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should navigate to home page', () => {
    const component = fixture.componentInstance;

    component.onClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
  it('should navigate to add playlist page if clicked on add button', () => {
    const compiled = fixture.nativeElement;

    compiled.querySelector('[data-testid="create-playlist"]').click();
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/addplaylist']);
  });
  it('should navigate to follow playlist page if clicked on follow button', () => {
    const compiled = fixture.nativeElement;

    compiled.querySelector('[data-testid="follow-playlist"]').click();
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/follow']);
  });
});
