import { Component, OnInit } from '@angular/core';
import { StoresService } from '../services/stores.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Md2Toast } from 'md2';
import { LocationService } from '../services/location/location.service';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';

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

    constructor(private dialog: MatDialog, private toast: Md2Toast, private locationService: LocationService, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title) {
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

            this.storeId = params['storeId'];

            this.feedbacksList$ = this.storesService.db.list(`stores/${this.storeId}/feedbacks`);
            this.feedbacksSubscription = this.feedbacksList$.subscribe((foundFeedbacks) => {
                this.feedbacksList = foundFeedbacks;
            });
        });
    }

    ngOnInit() {
        this.titleService.setTitle('Lojas');
    }

    sendReport(key, feedback) {
        console.log(feedback);
        this.storesService.reportFeedback(this.storeId, key, feedback);
    }
}
