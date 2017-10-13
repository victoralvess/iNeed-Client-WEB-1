import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsDashboardRoutingModule } from './products-dashboard-routing.module';
import { ProductsDashboardComponent } from './products-dashboard.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { ProductsService } from './services/products.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { MultiSelectModule, GrowlModule } from 'primeng/primeng';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModalModule } from 'ngx-modialog';
// import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { SearchPipeModule } from '../../../shared/pipes/search/search-pipe.module';
import { NotificationsService } from '../../../shared/services/notifications/notifications.service';

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
@NgModule({
  imports: [
    FlexLayoutModule,
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
    SearchPipeModule,
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
    MatStepperModule
  ],
  declarations: [ProductsDashboardComponent, AddProductsComponent, EditProductsComponent],
  exports: [ProductsDashboardComponent, AddProductsComponent, EditProductsComponent],
  providers: [ProductsService, NotificationsService]
})
export class ProductsDashboardModule { }
