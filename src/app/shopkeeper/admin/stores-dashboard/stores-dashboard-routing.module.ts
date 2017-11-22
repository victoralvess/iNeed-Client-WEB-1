import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoresDashboardComponent } from './stores-dashboard.component';
import { AddStoresComponent } from './add-stores/add-stores.component';
import { EditStoresComponent } from './edit-stores/edit-stores.component';
import { DeleteStoresComponent } from './delete-stores/delete-stores.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { MustBeAdminGuard } from '../../guards/must-be-admin/must-be-admin.guard';

const routes: Routes = [
  { path: '', component: StoresDashboardComponent },
  { path: 'add', canActivate: [MustBeAdminGuard], data: { normal: true }, component: AddStoresComponent },
  { path: 'edit/:storeId', canActivate: [MustBeAdminGuard], data: { normal: true }, component: EditStoresComponent },
  { path: 'delete/:storeId', canActivate: [MustBeAdminGuard], data: { normal: true }, component: DeleteStoresComponent },
  { path: 'feedbacks/:storeId', component: FeedbacksComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresDashboardRoutingModule { }
