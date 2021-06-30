import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';
import User from 'src/app/types/User';

import { PlaylistPageComponent } from './playlistpage.component';

describe('PlaylistPageComponent', () => {
  let component: PlaylistPageComponent;
  let fixture: ComponentFixture<PlaylistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaylistPageComponent],
      imports: [NgReduxTestingModule, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    MockNgRedux.reset();

    const titleStub: Subject<string> = MockNgRedux.getSelectorStub<
      RootState,
      string
    >('title');
    const lockStatusStub: Subject<boolean> = MockNgRedux.getSelectorStub<
      RootState,
      boolean
    >('lockStatus');
    const ownerStub: Subject<string> = MockNgRedux.getSelectorStub<
      RootState,
      string
    >('owner');
    const ownerNameStub: Subject<string> = MockNgRedux.getSelectorStub<
      RootState,
      string
    >('ownerName');
    const songsStub: Subject<Song[]> = MockNgRedux.getSelectorStub<
      RootState,
      Song[]
    >('songs');
    const partySongStub: Subject<{
      youtubeId: string;
      title: string;
      startTime: string;
    }> = MockNgRedux.getSelectorStub<
      RootState,
      {
        youtubeId: string;
        title: string;
        startTime: string;
      }
    >('partySong');
    const currentUserStub: Subject<User> = MockNgRedux.getSelectorStub<
      RootState,
      User
    >('currentUser');

    titleStub.next('fake title');
    lockStatusStub.next(true);
    currentUserStub.next({
      id: 'fake_id',
      name: 'fake user name',
      email: 'fake email',
    });
    ownerStub.next('fake user id');
    ownerNameStub.next('fake owner name');
    songsStub.next([
      {
        id: 'fake song id',
        youtubeId: 'fake youtube id',
        title: 'song title',
        votes: 8,
        userId: 'fake user id',
        userName: 'fake user name',
        upVoted: true,
        downVoted: false,
      },
    ]);

    partySongStub.next({
      youtubeId: 'fake youtube id',
      title: 'fake title',
      startTime: 'fake start time',
    });

    currentUserStub.next({
      id: 'fake user id',
      name: 'fake name',
      email: 'fake email'
    })

    titleStub.complete();
    lockStatusStub.complete();
    ownerNameStub.complete();
    ownerNameStub.complete();
    songsStub.complete();
    partySongStub.complete();
    currentUserStub.complete();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
