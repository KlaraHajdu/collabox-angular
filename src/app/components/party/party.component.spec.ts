import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgReduxTestingModule } from '@angular-redux/store/testing';

import { PartyComponent } from './party.component';


describe('PartyComponent', () => {
  let component: PartyComponent;
  let fixture: ComponentFixture<PartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyComponent ],
      imports: [NgReduxTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('is unmuted on render', () => {
    const compiled = fixture.nativeElement;

    const volumeButtonIcon = compiled.querySelector('.material-icons-round');

    expect(volumeButtonIcon.textContent).toContain('volume_off');
  });
});
