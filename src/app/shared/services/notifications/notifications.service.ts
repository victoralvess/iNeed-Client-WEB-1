import { Injectable } from '@angular/core';

import { Message } from 'primeng/primeng';

@Injectable()
export class NotificationsService {
  private _notification : Message;

  success(summary : string, detail : string) {
    this._notification = {
<<<<<<< HEAD
      severity : NotificationsSeverity.SUCCESS.valueOf()
=======
      severity : 'success'
>>>>>>> stores-module
    };
    return this.generateNotification(summary, detail);
  }

  error(summary : string, detail : string) {
    this._notification = {
<<<<<<< HEAD
      severity : NotificationsSeverity.ERROR.valueOf()
=======
      severity : 'error'
>>>>>>> stores-module
    };
    return this.generateNotification(summary, detail);
  }

  generateNotification(summary : string, detail : string) {
    this._notification.summary = summary;
    this._notification.detail = detail;
    return this._notification;
  }

}
<<<<<<< HEAD

export enum NotificationsSeverity {
  SUCCESS = 'success',
  ERROR = 'error'
}
=======
>>>>>>> stores-module
