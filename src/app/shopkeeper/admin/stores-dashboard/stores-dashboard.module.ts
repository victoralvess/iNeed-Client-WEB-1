import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresDashboardRoutingModule } from './stores-dashboard-routing.module';
import { StoresDashboardComponent } from './stores-dashboard.component';
import { AddStoresComponent } from './add-stores/add-stores.component';
import { EditStoresComponent } from './edit-stores/edit-stores.component';
import { CodeHighlighterModule, InputMaskModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpModule } from '@angular/http';
import { Md2Module, NoConflictStyleCompatibilityMode } from 'md2';
import { CovalentDialogsModule, CovalentDataTableModule } from '@covalent/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadModule } from 'angular2-image-upload';
import { ProductsService } from '../products-dashboard/services/products.service';
import { NotificationsService } from '../../../shared/services/notifications/notifications.service';
import { CrudService } from '../../../shared/services/crud-service/crud.service';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';

import { StoresService } from './services/stores.service';
import { LocationService } from './services/location/location.service';
import { TimePickerDialogComponent } from './time-picker-dialog/time-picker-dialog.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
@NgModule({
  imports: [
    CommonModule,
    StoresDashboardRoutingModule,
    InputMaskModule,
    ColorPickerModule,
    CodeHighlighterModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    HttpModule,
    Md2Module,
    NoConflictStyleCompatibilityMode,
    CovalentDialogsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    FlexLayoutModule,
    CovalentDataTableModule
  ],
  declarations: [StoresDashboardComponent, AddStoresComponent, EditStoresComponent, TimePickerDialogComponent, FeedbacksComponent],
  providers: [StoresService, LocationService, ProductsService, NotificationsService, CrudService],
  exports: [TimePickerDialogComponent],
  entryComponents: [TimePickerDialogComponent]
})
export class StoresDashboardModule {
}
