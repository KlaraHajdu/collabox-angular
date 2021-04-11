import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonglistItemComponent } from './songlist-item.component';

describe('SonglistItemComponent', () => {
  let component: SonglistItemComponent;
  let fixture: ComponentFixture<SonglistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SonglistItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SonglistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
