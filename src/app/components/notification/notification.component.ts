import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import RootState from 'src/app/store/RootState';
import Notification from 'src/app/types/Notification';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass']
})
export class NotificationComponent implements OnInit {

  @select((state:RootState) => state.notifications.notifications) notifications$: Observable<Notification[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
