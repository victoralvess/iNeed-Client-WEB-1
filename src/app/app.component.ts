import { Component } from '@angular/core';
import { Auth0Service } from './shared/services/auth0-service/auth0.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private auth0Service: Auth0Service) {
    console.log('i was here');
  }
}
