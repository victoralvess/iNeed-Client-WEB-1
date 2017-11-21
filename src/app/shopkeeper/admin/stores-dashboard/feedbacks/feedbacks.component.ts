import { Component, OnInit } from '@angular/core';
import { StoresService } from '../services/stores.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '../models/store.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StoreLocation } from '../models/store-location.model';
import { Category } from '../../../models/category.model';
import { Md2Colorpicker, Md2Toast } from 'md2';
import { FileHolder } from 'angular2-image-upload';
import { LocationService } from '../services/location/location.service';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { TimePickerDialogComponent } from '../time-picker-dialog/time-picker-dialog.component';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {

  storeId;
  activatedRouteSubscription;
  feedbacksList$;
  feedbacksSubscription;
  feedbacksList;

  constructor(private dialog: MatDialog, private toast: Md2Toast, private locationService: LocationService, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

      this.storeId = params['storeId'];

      this.feedbacksList$ = this.storesService.db.list(`stores/${this.storeId}/feedbacks`);
      this.feedbacksSubscription = this.feedbacksList$.subscribe((foundFeedbacks) => {
        this.feedbacksList = foundFeedbacks;
      });
    });
  }

  ngOnInit() {
  }

sendReport(key,feedback) {
console.log(feedback);
this.storesService.reportFeedback(this.storeId, key, feedback);
}

}
