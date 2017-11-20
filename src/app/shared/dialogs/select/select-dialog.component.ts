import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-select-dialog',
    templateUrl: 'select-dialog.html',
    styleUrls: ['select-dialog.scss']
})
export class SelectDialogComponent {

    cancelButton = 'CANCELAR';
    acceptButton = 'CONFIRMAR';
    options: any[];
    selected: any;

    constructor( @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SelectDialogComponent>) {
        this.options = data.options;
    }

    accept() {
        this.dialogRef.close(this.selected);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}
