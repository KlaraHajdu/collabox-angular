import { MockNgRedux } from '@angular-redux/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';
import User from 'src/app/types/User';

import { SonglistComponent } from './songlist.component';

describe('SonglistComponent', () => {
  let component: SonglistComponent;
  let fixture: ComponentFixture<SonglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SonglistComponent],
    }).compileComponents();
    MockNgRedux.reset();

    const songListStub: Subject<Song[]> =
      MockNgRedux.getSelectorStub<RootState, Song[]>('songs');
    const ownerIdStub: Subject<string> =
      MockNgRedux.getSelectorStub<RootState, string>('owner');
    const lockStatusStub: Subject<boolean> =
      MockNgRedux.getSelectorStub<RootState, boolean>('lockStatus');
    const currentUserStub: Subject<User> =
      MockNgRedux.getSelectorStub<RootState, User>('currentUser');

    songListStub.next([
      {
        id: 'fake_id',
        youtubeId: 'fake_youtube_id',
        title: 'fake_title',
        votes: 8,
        userId: 'fake_user_id',
        userName: 'User',
        upVoted: false,
        downVoted: true,
      },
    ]);

    ownerIdStub.next('fake_user_id');
    lockStatusStub.next(false);
    currentUserStub.next({
      id: 'fake_user_id',
      name: 'Fake user name',
      email: 'fake_email',
    });

    songListStub.complete();
    ownerIdStub.complete();
    lockStatusStub.complete();
    currentUserStub.complete();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SonglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
