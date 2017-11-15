import { Component, OnInit } from '@angular/core';

import { Auth0Service } from '../shared/services/auth0-service/auth0.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private auth0Service: Auth0Service) { this.auth0Service.handleAuthentication(); }

  ngOnInit() {
  }

}
