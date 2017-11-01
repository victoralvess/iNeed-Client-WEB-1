import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'subscribe', loadChildren: './subscribe/subscribe.module#SubscribeModule'
  },
  {
    path: 'shopkeeper', loadChildren: './shopkeeper/shopkeeper.module#ShopkeeperModule'
  },
  {
    path: 'callback', component: CallbackComponent
  },
  {
    path: '**', redirectTo: 'home', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
