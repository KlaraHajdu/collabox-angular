import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { FollowPlaylistComponent } from './follow-playlist.component';

describe('FollowPlaylistComponent', () => {
  let component: FollowPlaylistComponent;
  let fixture: ComponentFixture<FollowPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowPlaylistComponent ],
      imports: [ RouterTestingModule, NgReduxTestingModule, ReactiveFormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the title', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.title').textContent).toContain('Follow a playlist');
  });
  it('should disable submit button when rendered', () => {
    const compiled = fixture.nativeElement;

    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)
  });
  it('should enable the submit button if ID of correct length is given', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="11111111111111111111"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(false)
  });
  it('should disable the submit button if ID is too long', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="1111111111111111111122222"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(true)
  });
  it('should disable the submit button if ID is too short', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="111"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(true)
  });
  it('should show helper text if name is too long', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="1111111111111111111122222"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
  });
  it('should show helper text if name is too short', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="11111111"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
  });
  it('should dispatch action if submit button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    const input = fixture.debugElement.query(By.css('.input'));
    input.nativeElement.value="11111111111111111111"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    compiled.querySelector('.submit-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
});
