import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopkeeperRoutingModule } from './shopkeeper-routing.module';
import { ShopkeeperComponent } from './shopkeeper.component';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
@NgModule({
  imports: [
    CommonModule,
    ShopkeeperRoutingModule
  ],
  declarations: [ShopkeeperComponent, MainDashboardComponent],
  exports: [],
  providers: []
})
export class ShopkeeperModule { }
