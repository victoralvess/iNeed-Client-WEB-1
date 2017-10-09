import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  // Começa no metodo de sign Up
  private method: string = 'signUp';

  constructor() { }

  ngOnInit() {
  }

}
