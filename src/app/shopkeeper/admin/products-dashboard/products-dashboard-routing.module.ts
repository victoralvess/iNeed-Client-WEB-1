import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsDashboardComponent } from './products-dashboard.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { MustBeAdminGuard } from '../../guards/must-be-admin/must-be-admin.guard';

const routes: Routes = [
  { path: '', canActivate: [MustBeAdminGuard], data: { normal: true }, component: ProductsDashboardComponent },
  { path: 'add', canActivate: [MustBeAdminGuard], data: { normal: true }, component: AddProductsComponent },
  { path: 'edit/:productId', canActivate: [MustBeAdminGuard], data: { normal: true }, component: EditProductsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsDashboardRoutingModule { }
