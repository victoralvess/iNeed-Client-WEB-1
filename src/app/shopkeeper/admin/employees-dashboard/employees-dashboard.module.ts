import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeesDashboardRoutingModule } from './employees-dashboard-routing.module';
import { AddEmployeesComponent } from './add-employees/add-employees.component';
import { EmployeesDashboardComponent } from './employees-dashboard.component';
import { EditEmployeesComponent } from './edit-employees/edit-employees.component';

import { EmployeesService } from './services/employees.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { MultiSelectModule, GrowlModule } from 'primeng/primeng';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModalModule } from 'ngx-modialog';
// import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { CovalentDialogsModule } from '@covalent/core';
import { NoConflictStyleCompatibilityMode, CompatibilityModule } from '@angular/material';
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { CrudService } from '../../../shared/services/crud-service/crud.service';
import { Auth0Service } from '../../../shared/services/auth0-service/auth0.service';
@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    EmployeesDashboardRoutingModule,
    MultiSelectModule,
    GrowlModule,
    ImageUploadModule.forRoot(),
    ModalModule.forRoot(),
    CovalentDialogsModule,
    NoConflictStyleCompatibilityMode,
    CompatibilityModule,
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
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    EmployeesDashboardRoutingModule,
    MultiSelectModule,
    GrowlModule,
    ImageUploadModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [EmployeesDashboardComponent, AddEmployeesComponent, EditEmployeesComponent],
  exports: [EmployeesDashboardComponent, AddEmployeesComponent, EditEmployeesComponent],
  providers: [EmployeesService, CrudService, Auth0Service]
})
export class EmployeesDashboardModule { }
