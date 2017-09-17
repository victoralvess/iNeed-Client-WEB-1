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
import {ImageUploadModule} from 'angular2-image-upload';

@NgModule({
  imports: [
    CommonModule,
    StoresDashboardRoutingModule,
    InputMaskModule,
    ColorPickerModule,
    CodeHighlighterModule,
    ImageUploadModule.forRoot(),
    FormsModule
  ],
  declarations: [StoresDashboardComponent, AddStoresComponent, EditStoresComponent, DeleteStoresComponent]
})
export class StoresDashboardModule {
}
