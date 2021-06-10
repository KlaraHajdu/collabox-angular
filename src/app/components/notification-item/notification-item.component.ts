import { NgRedux } from '@angular-redux/store';
import { Component, Input, OnInit, Output } from '@angular/core';
import RootState from 'src/app/store/RootState';
import Notification from 'src/app/types/Notification';
import SEVERITY from 'src/app/types/Severity';
import { notificationActions } from '../../store/slices/notification/slice';
import { notificationMessages } from '../../utils/notificationMessages';

@Component({
  selector: 'notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.sass']
})
export class NotificationItemComponent implements OnInit {
  @Input() notification: Notification
  notificationMessages: any

  constructor(private ngRedux: NgRedux<RootState>) { }

  ngOnInit(): void {
    this.notificationMessages = notificationMessages
    if (this.notification?.severity !== SEVERITY.Error) {
      setTimeout(() => this.deleteNotification(), 3000)
    }
  }

  setSeverityClass() {
    return this.notification.severity
  }

  close() {
    this.deleteNotification()
  }

  deleteNotification() {
    this.ngRedux.dispatch<any>(notificationActions.DELETE_NOTIFICATION(this.notification.id))
  }
}
