import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsDashboardComponent } from './products-dashboard.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';

const routes: Routes = [
  { path: '', component: ProductsDashboardComponent },
  { path: 'add', component: AddProductsComponent },
  { path: 'edit/:productId', component: EditProductsComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsDashboardRoutingModule { }
