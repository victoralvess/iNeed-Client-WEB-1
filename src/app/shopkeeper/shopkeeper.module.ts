import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopkeeperRoutingModule } from './shopkeeper-routing.module';
import { ShopkeeperComponent } from './shopkeeper.component';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
import { MatToolbarModule } from '@angular/material';
import { MatIconModule, MatButtonModule, MatMenuModule, MatListModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material';
import { CovalentMenuModule, CovalentLayoutModule } from '@covalent/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    ShopkeeperRoutingModule,
    MatToolbarModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatListModule, MatSidenavModule, FlexLayoutModule,
    CovalentMenuModule, CovalentLayoutModule
  ],
  declarations: [ShopkeeperComponent, MainDashboardComponent],
  exports: [],
  providers: []
})
export class ShopkeeperModule { }
