import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesDashboardComponent } from './employees-dashboard.component';
import { AddEmployeesComponent } from './add-employees/add-employees.component';
import { EditEmployeesComponent } from './edit-employees/edit-employees.component';

const routes: Routes = [
  { path: '', component: EmployeesDashboardComponent },
  { path: 'add', component: AddEmployeesComponent },
  { path: 'edit/:employeeId', component: EditEmployeesComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesDashboardRoutingModule { }
