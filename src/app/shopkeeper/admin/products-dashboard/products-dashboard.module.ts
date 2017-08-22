import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsDashboardRoutingModule } from './products-dashboard-routing.module';
import { ProductsDashboardComponent } from './products-dashboard.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { ProductsService } from './services/products.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MultiSelectModule, GrowlModule } from 'primeng/primeng';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
		NgxPaginationModule,
    ProductsDashboardRoutingModule,
    MultiSelectModule,
    GrowlModule,
    ImageUploadModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  declarations: [SearchPipe, ProductsDashboardComponent, AddProductsComponent, EditProductsComponent],
  exports: [SearchPipe, ProductsDashboardComponent, AddProductsComponent, EditProductsComponent],
  providers: [ProductsService] 
})
export class ProductsDashboardModule { }
 