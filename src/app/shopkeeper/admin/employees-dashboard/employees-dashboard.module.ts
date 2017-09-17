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
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { SearchPipeModule } from '../../../shared/pipes/search/search-pipe.module';

@NgModule({
  imports: [
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
    BootstrapModalModule,
    SearchPipeModule
  ],  
  declarations: [EmployeesDashboardComponent, AddEmployeesComponent, EditEmployeesComponent],
  exports: [EmployeesDashboardComponent, AddEmployeesComponent, EditEmployeesComponent],
  providers: [EmployeesService] 
})
export class EmployeesDashboardModule { }
