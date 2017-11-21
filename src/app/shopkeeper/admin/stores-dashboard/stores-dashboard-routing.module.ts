import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoresDashboardComponent } from './stores-dashboard.component';
import { AddStoresComponent } from './add-stores/add-stores.component';
import { EditStoresComponent } from './edit-stores/edit-stores.component';
import { DeleteStoresComponent } from './delete-stores/delete-stores.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';

const routes: Routes = [
  { path: '', component: StoresDashboardComponent },
  { path: 'add', component: AddStoresComponent },
  { path: 'edit/:storeId', component: EditStoresComponent },
  { path: 'delete/:storeId', component: DeleteStoresComponent },
  { path: 'feedbacks/:storeId', component: FeedbacksComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresDashboardRoutingModule { }
