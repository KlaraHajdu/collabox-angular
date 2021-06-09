import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AddPlaylistComponent } from './addplaylist.component';

describe('AddplaylistComponent', () => {
  let component: AddPlaylistComponent;
  let fixture: ComponentFixture<AddPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlaylistComponent ],
      imports: [ RouterTestingModule, NgReduxTestingModule, ReactiveFormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the title', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.title').textContent).toContain('Create a new playlist');
  });
  it('should disable submit button when rendered', () => {
    const compiled = fixture.nativeElement;

    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)
  });
  it('should enable the submit button if name of correct length is given', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="My awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(false)
  });
  it('should disable the submit button if name is too long', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="My awesome playlisttttttttttttttttttttttttttttttttttttttt"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(true)
  });
  it('should show helper text if name is too long', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="My awesome playlisttttttttttttttttttttttttttttttttttttttttt"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
  });
  it('should dispatch action if submit button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="My awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    compiled.querySelector('.submit-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
});
