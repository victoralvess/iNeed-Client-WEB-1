import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopkeeperComponent } from './shopkeeper.component';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
import { MustBeAdminGuard } from './guards/must-be-admin/must-be-admin.guard';
import { MustBeLoggedInGuard } from '../shared/guards/must-be-logged-in/must-be-logged-in.guard';

const routes: Routes = [
  { 
  	path: 'dashboard',
    component: ShopkeeperComponent,
    canActivate: [MustBeLoggedInGuard],
    children : [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: MainDashboardComponent },
      { path: 'admin', canActivate: [MustBeAdminGuard], children: [
          { path: 'products', loadChildren: './admin/products-dashboard/products-dashboard.module#ProductsDashboardModule' },
          { path: 'employees', loadChildren: './admin/employees-dashboard/employees-dashboard.module#EmployeesDashboardModule' },
          { path: 'stores', loadChildren: './admin/stores-dashboard/stores-dashboard.module#StoresDashboardModule' }
        ] 
      }
    ] 
  },
  { path: 'chat', canActivate: [MustBeLoggedInGuard], loadChildren: './chat/chat.module#ChatModule' },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MustBeAdminGuard, MustBeLoggedInGuard]
})
export class ShopkeeperRoutingModule { }
