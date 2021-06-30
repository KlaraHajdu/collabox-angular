import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Song from 'src/app/types/Song';

import { PlaysongComponent } from './playsong.component';

describe('PlaysongComponent', () => {
  let component: PlaysongComponent;
  let fixture: ComponentFixture<PlaysongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaysongComponent ],
      imports: [NgReduxTestingModule]
    })
    .compileComponents();

    const songsStub: Subject<Song[]> = MockNgRedux.getSelectorStub<
    RootState,
    Song[]
  >('songs');

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

  songsStub.complete();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaysongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
});
