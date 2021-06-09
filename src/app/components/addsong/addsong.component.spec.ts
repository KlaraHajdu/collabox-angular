import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AddsongComponent } from './addsong.component';

describe('AddsongComponent', () => {
  let component: AddsongComponent;
  let fixture: ComponentFixture<AddsongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsongComponent ],
      imports: [ RouterTestingModule, NgReduxTestingModule, ReactiveFormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsongComponent);
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
  it('should enable the submit button if url of correct length is given', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="https://www.youtube.com/watch?v=ewoonPUDY3I&list=PLoL51YuCgZdXaTEx93Kr8hLffckqka7DT&index=41"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(false)
  });
  it('should disable the submit button if url is too long', () => {
    const compiled = fixture.nativeElement;
    const submitButton  = compiled.querySelector('.submit-button');
    expect(submitButton.disabled).toBe(true)

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="https://www.youtube.com/watch?v=ewoonPUDY3I&list=PLoL51YuCgZdXaTEx93Kr8hLffckqka7DT&index=4111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()

    expect(submitButton.disabled).toBe(true)
  });
  it('should dispatch action if submit button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    const input = fixture.debugElement.query(By.css('.add-input'));
    input.nativeElement.value="https://www.youtube.com/watch?v=ewoonPUDY3I&list=PLoL51YuCgZdXaTEx93Kr8hLffckqka7DT&index=41"
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges()
    compiled.querySelector('.submit-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
});
