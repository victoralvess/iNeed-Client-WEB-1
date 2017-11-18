import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../shared/services/services-auth/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-shopkeeper',
  templateUrl: './shopkeeper.component.html',
  styleUrls: ['./shopkeeper.component.css']
})
export class ShopkeeperComponent implements OnInit, AfterViewInit {

  user: any;
  chosenInitialized: boolean = false;

  // HOME PROD LOJ FUN CHAT

  routes: Object[] = [{
    icon: 'home',
    route: '/shopkeeper/dashboard/home',
    title: 'Home',
  }, {
    icon: 'shopping_basket',
    route: '/shopkeeper/dashboard/admin/products',
    title: 'Produtos',
  }, {
    icon: 'store',
    route: '/shopkeeper/dashboard/admin/stores',
    title: 'Lojas',
  }, {
    icon: 'people',
    route: '/shopkeeper/dashboard/admin/employees',
    title: 'Funcionários',
  }, {
    icon: 'chat',
    route: '/shopkeeper/chat',
    title: 'Chat',
  }
  ];

  constructor(private afAuth: AngularFireAuth, private service: AuthService, private router: Router) {
    this.user = afAuth.auth.currentUser;

    this.afAuth.auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('mata tuto chessus');
        this.router.navigate(['/subscribe/signin']);
      }
    });
  }


  ngAfterViewInit() {

    if (!this.chosenInitialized) {
      $(document).ready(function () {
        $('[data-toggle="offcanvas"]').click(function () {
          $('#navigation').toggleClass('hidden-xs');
        });
      });
    }
  }

  ngOnInit() {
  }

  onClickLogout() {
    this.service.logout();
    this.router.navigate(['/home']);
  }

}
