import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoresDashboardRoutingModule} from './stores-dashboard-routing.module';
import {StoresDashboardComponent} from './stores-dashboard.component';
import {AddStoresComponent} from './add-stores/add-stores.component';
import {EditStoresComponent} from './edit-stores/edit-stores.component';
import {DeleteStoresComponent} from './delete-stores/delete-stores.component';
import {CodeHighlighterModule, InputMaskModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {ColorPickerModule} from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
 import { HttpModule } from '@angular/http';
import { Md2Module } from 'md2';
import { CovalentDialogsModule } from '@covalent/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadModule } from 'angular2-image-upload';
import {
  MdInput,
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdStepperModule,
  MatSelectModule
} from '@angular/material';

import { StoresService } from './services/stores.service';
import { LocationService } from './services/location/location.service';

@NgModule({
  imports: [
    CommonModule,
    StoresDashboardRoutingModule,
    InputMaskModule,
    ColorPickerModule,
    CodeHighlighterModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
TextMaskModule,
HttpModule,
Md2Module,
CovalentDialogsModule,
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdStepperModule,
  MatSelectModule,
  FlexLayoutModule
  ],
  declarations: [StoresDashboardComponent, AddStoresComponent, EditStoresComponent, DeleteStoresComponent],
  providers: [StoresService, LocationService]
})
export class StoresDashboardModule {
}
