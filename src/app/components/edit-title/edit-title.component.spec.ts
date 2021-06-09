import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { EditTitleComponent } from './edit-title.component';

describe('EditComponentComponent', () => {
  let component: EditTitleComponent;
  let fixture: ComponentFixture<EditTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTitleComponent ],
      imports: [ NgReduxTestingModule, ReactiveFormsModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My renamed awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(false)
  });
  it('should disable the submit button if name is too long', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My renamed awesome playlisttttttttttttttttttttttttttttttttttttttt"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(true)
  });
  it('should not show helper text when name is of correct length', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My renamed awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    console.log(!!helperText)
    expect(helperText.textContent).toContain('');
  });
  it('should show helper text if name is too long', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My awesome playlisttttttttttttttttttttttttttttttttttttttttt"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    expect(helperText.textContent).toContain('Too long title for a playlist!');
  });
  it('should show helper text if name is empty', () => {
    const compiled = fixture.nativeElement;

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value=""
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    const helperText  = compiled.querySelector('.helper-text');
    expect(helperText.textContent).toContain('Playlist title cannot be empty!');
  });
  it('should dispatch action if submit button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    compiled.querySelector('.submit-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
  it('should close if submit button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(component.close, 'emit');

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value="My awesome playlist"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    compiled.querySelector('.submit-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
  it('should close if cancel button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(component.close, 'emit');

    compiled.querySelector('.cancel-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
  it('should not dispatch action if cancel button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    compiled.querySelector('.cancel-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
});
