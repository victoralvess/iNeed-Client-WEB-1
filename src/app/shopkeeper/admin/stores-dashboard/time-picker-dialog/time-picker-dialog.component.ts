import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-time-picker-dialog',
    templateUrl: 'time-picker-dialog.html',
    styleUrls: ['time-picker-dialog.scss']
})
export class TimePickerDialogComponent {

    cancelButton = 'CANCELAR';
    acceptButton = 'CONFIRMAR';
    day;
    time: OpeningClosing = {};

    constructor( @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<TimePickerDialogComponent>) {
        this.day = data.day;
        this.time.day = data.day;

        if (data.opening && data.closing) {
            this.time.opening = new Date(data.opening);
            this.time.closing = new Date(data.closing);
        } else {
            this.time.opening = new Date();
            this.time.closing = new Date();
        }
    }

    accept() {
        const timeRegExp = /\d\d:\d\d/;
        this.time.openingParsed = this.time.opening.toTimeString().match(timeRegExp)[0];
        this.time.closingParsed = this.time.closing.toTimeString().match(timeRegExp)[0];
        this.dialogRef.close(this.time);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}

export interface OpeningClosing {
    day?: string;
    opening?: Date;
    closing?: Date;
    openingParsed?: string;
    closingParsed?: string;
}
