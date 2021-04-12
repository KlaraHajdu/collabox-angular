import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysongComponent } from './playsong.component';

describe('PlaysongComponent', () => {
  let component: PlaysongComponent;
  let fixture: ComponentFixture<PlaysongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaysongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaysongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
