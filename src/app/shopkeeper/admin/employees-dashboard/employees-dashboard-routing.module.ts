import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesDashboardComponent } from './employees-dashboard.component';
import { AddEmployeesComponent } from './add-employees/add-employees.component';
import { EditEmployeesComponent } from './edit-employees/edit-employees.component';
import { MustBeAdminGuard } from '../../guards/must-be-admin/must-be-admin.guard';

const routes: Routes = [
  { path: '', component: EmployeesDashboardComponent, canActivate: [MustBeAdminGuard], data: {sudo: true} },
  { path: 'add', component: AddEmployeesComponent, canActivate: [MustBeAdminGuard], data: {sudo: true} },
  { path: 'edit/:employeeId', component: EditEmployeesComponent, canActivate: [MustBeAdminGuard], data: {sudo: true} },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesDashboardRoutingModule { }
