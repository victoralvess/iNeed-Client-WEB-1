import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Store } from '../../../models/store.model';
import { EmployeesService } from '../services/employees.service';
import { Http, RequestOptionsArgs, Headers, RequestMethod } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-add-employees',
  templateUrl: './add-employees.component.html',
  styleUrls: ['./add-employees.component.css']
})
export class AddEmployeesComponent implements OnInit, OnDestroy {

  employeeForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
    email: new FormControl('', Validators.compose([Validators.required])),
    permissionLevel: new FormControl('', Validators.required),
    stores: new FormControl([], Validators.required)
  });

  permissions: Permission[] = [
    {
      value: 1,
      function: 'Pode visualizar e responder feedbacks'
    },
    {
      value: 2,
      function: 'Pode cadastrar lojas e produtos'
    },
    {
      value: 3,
      function: 'Pode cadastrar novos funcionários'
    }
  ];

  stores: Store[] = [];
  userSubscription: Subscription;

  constructor(private employeesService: EmployeesService, private http: Http) {
    this.userSubscription = employeesService.getStoresWhereUserWorks().subscribe((stores) => {
      stores.forEach(store => {
        this.stores.push({ id: store.$key, name: store.name, address: store.location.address, checked: false });
      });
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  addEmployee(data) {
    data.stores = <string>((<any[]>data.stores).join('|'));
    this.employeesService.addEmployee(data);
  }
}

export interface Permission {
  value: number;
  function: string;
}
