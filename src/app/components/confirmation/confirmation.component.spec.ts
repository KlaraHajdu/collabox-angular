import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the right message', () => {
    const compiled = fixture.nativeElement;
    component.message = "Are you sure you want to delete this playlist?";
    fixture.detectChanges();

    const question = compiled.querySelector('.message-wrapper')
    expect(question.textContent).toContain("Are you sure you want to delete this playlist?");
  });
  it('should close if cancel button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(component.close, 'emit');

    compiled.querySelector('.cancel-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
  it('should emit confirm event if confirm button is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(component.confirm, 'emit');

    compiled.querySelector('.confirm-button').click();
    fixture.detectChanges()

    expect(spy).toHaveBeenCalled();
  });
});
