import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { TimePickerDialogComponent } from '../time-picker-dialog/time-picker-dialog.component';


export class TimeOperationsController {
    public daysOfTheWeek = [
        { day: 'Segunda', checked: false },
        { day: 'Terça', checked: false },
        { day: 'Quarta', checked: false },
        { day: 'Quinta', checked: false },
        { day: 'Sexta', checked: false },
        { day: 'Sábado', checked: false },
        { day: 'Domingo', checked: false }
    ];
    public openingClosingArr = [];

    constructor(private dialog: MatDialog, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService) {}

    openTimePickerDialog(day, checked) {
        console.log('MYTAG_', this.daysOfTheWeek);
        this.daysOfTheWeek[this.daysOfTheWeek.map((e) => e.day).indexOf(day)].checked = checked;
        console.log('MYTAG_', this.daysOfTheWeek);
        let index = this.openingClosingArr.map((e) => e.day).indexOf(day);
        if (checked) {
            console.log(day);
            let dialogRef;
            if (!(index > -1)) {
                console.log('nao é maior que -1');
                dialogRef = this.dialog.open(TimePickerDialogComponent, {
                    data: { day: day }
                });
            } else {
                console.log('here');
                dialogRef = this.dialog.open(TimePickerDialogComponent, {
                    data: { day: day, opening: this.openingClosingArr[index].opening, closing: this.openingClosingArr[index].closing }
                });
            }

            dialogRef.afterClosed().subscribe((response: any) => {
                if (response) {
                    console.log('time', response);
                    this.openingClosingArr.push(response);
                    console.log('opcl', this.openingClosingArr);
                } else {
                    this.removeTimesUnchecked(index);
                    this.daysOfTheWeek[this.daysOfTheWeek.map((e) => e.day).indexOf(day)].checked = false;
                }
            });
        } else {
            this.removeTimesUnchecked(index);
            this.daysOfTheWeek[this.daysOfTheWeek.map((e) => e.day).indexOf(day)].checked = false;
        }
    }

    removeTimesUnchecked(index) {
        if (index > -1) {
            this.openingClosingArr.splice(index, 1);
        }
        if (this.openingClosingArr.length === 0) {
            this.openingClosingArr = [];
        } else {
        }
        console.log('opcl', this.openingClosingArr);
    }
}
