import {MockNgRedux, NgReduxTestingModule} from '@angular-redux/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SonglistItemComponent } from './songlist-item.component';

describe('SonglistItemComponent', () => {
  let component: SonglistItemComponent;
  let fixture: ComponentFixture<SonglistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SonglistItemComponent ],
      imports: [ NgReduxTestingModule],
    })
    .compileComponents();
    MockNgRedux.reset();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SonglistItemComponent);
    component = fixture.componentInstance;
    component.canDelete = true;
    component.ownPlaylist = true;
    component.song  = {
      id: 'fake_id',
      youtubeId: 'fake_youtube_id',
      title: 'fake_title',
      votes: 8,
      userId: 'fake_user_id',
      userName: 'User',
      upVoted: false,
      downVoted: true,
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the title', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.title').textContent).toContain('fake_title');
  });
  it('should render who added', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.addedBy').textContent).toContain('User');
  });
  it('should render the number of votes', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.votes').textContent).toContain('8');
  });
  it('should dispatch action if upvote is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    compiled.querySelector('[data-testid="upvote"]').click();

    expect(spy).toHaveBeenCalled();
  });
  it('should dispatch action if downvote is clicked', () => {
    const compiled = fixture.nativeElement;
    const spy = spyOn(MockNgRedux.getInstance(), "dispatch");

    compiled.querySelector('[data-testid="downvote"]').click();

    expect(spy).toHaveBeenCalled();
  });
  it('should show confirmation if delete is clicked', () => {
    const compiled = fixture.nativeElement;

    compiled.querySelector('[data-testid="delete"]').click();

    expect(component.confirmationVisible).toBeTrue();
  });
  it('should not show delete icon if user cannot delete song', () => {
    const compiled = fixture.nativeElement;
    component.canDelete = false;
    fixture.detectChanges();

    const deleteIcon = compiled.querySelector('[data-testid="delete"]');

    expect(deleteIcon).toBeFalsy();
  });
});
