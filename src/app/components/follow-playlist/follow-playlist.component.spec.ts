import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPlaylistComponent } from './follow-playlist.component';

describe('FollowPlaylistComponent', () => {
  let component: FollowPlaylistComponent;
  let fixture: ComponentFixture<FollowPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowPlaylistComponent ]
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
});
