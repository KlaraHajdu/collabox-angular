import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';

import { NotificationItemComponent } from './notification-item.component';
import SEVERITY from 'src/app/types/Severity';


describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationItemComponent],
      imports: [NgReduxTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.notification = {
      id: 0,
      message: 'database_error',
      severity: SEVERITY.Error,
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should show the right notification', () => {
    const compiled = fixture.nativeElement;
    component.notification = {
      id: 0,
      message: 'database_error',
      severity: SEVERITY.Error,
    };
    component.ngOnInit();
    fixture.detectChanges();

    const message = compiled.querySelector('.message');

    expect(message.textContent).toContain('Sorry, the database is down.');
  });
  it('should style the error notification with the right class', () => {
    const compiled = fixture.nativeElement;
    component.notification = {
      id: 0,
      message: 'database_error',
      severity: SEVERITY.Error,
    };
    component.ngOnInit();
    fixture.detectChanges();
    const container: HTMLElement = compiled.querySelector('.container');

    expect(container).toHaveClass('error');
  });
  it('should style the info notification with the right class', () => {
    const compiled = fixture.nativeElement;
    component.notification = {
      id: 0,
      message: 'playlist_created',
      severity: SEVERITY.Info,
    };
    component.ngOnInit();
    fixture.detectChanges();
    const container: HTMLElement = compiled.querySelector('.container');

    expect(container).toHaveClass('info');
  });
  it('should style the warning notification with the right class', () => {
    const compiled = fixture.nativeElement;
    component.notification = {
      id: 0,
      message: 'duplicate_song',
      severity: SEVERITY.Warning,
    };
    component.ngOnInit();
    fixture.detectChanges();
    const container: HTMLElement = compiled.querySelector('.container');

    expect(container).toHaveClass('warning');
  });
  it('should dispatch delete action for warning notification after 3 seconds', fakeAsync(() => {
    const spy = spyOn(MockNgRedux.getInstance(), 'dispatch');
    component.notification = {
      id: 0,
      message: 'duplicate_song',
      severity: SEVERITY.Warning,
    };
    component.ngOnInit();
    fixture.detectChanges();
    tick(3500);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));
  it('should dispatch delete action for info notification after 3 seconds', fakeAsync(() => {
    const spy = spyOn(MockNgRedux.getInstance(), 'dispatch');
    component.notification = {
      id: 0,
      message: 'playlist_created',
      severity: SEVERITY.Info,
    };
    component.ngOnInit();
    fixture.detectChanges();
    tick(3500);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));
  it('should not dispatch delete action for error notification after 3 seconds', fakeAsync(() => {
    const spy = spyOn(MockNgRedux.getInstance(), 'dispatch');
    component.notification = {
      id: 0,
      message: 'database_error',
      severity: SEVERITY.Error,
    };
    component.ngOnInit();
    fixture.detectChanges();
    tick(3500);
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  }));
});
