import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.css']
})
export class AddEmployeesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	console.log('WORKS');
  }

}
