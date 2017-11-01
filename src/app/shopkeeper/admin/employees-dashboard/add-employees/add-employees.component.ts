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
    email: new FormControl('', Validators.required),
    login: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(8), CustomValidators.maxLength(20)])),
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
  // files = [];

  constructor(private employeesService: EmployeesService, private http: Http) {
    this.userSubscription = employeesService.getStoresWhereUserWorks().subscribe((stores) => {
      stores.forEach(store => {
        this.stores.push({ id: store.$key, name: store.name, address: store.location.address, checked: false });
      });
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  addEmployee(data) {
    //data.images = [];
    //if (this.files.length === 0) {
    //  alert('IMAGEM');
    //  return;
    //} else {
    //  this.files.forEach((file, idx, arr) => {
    //    this.employeesService.optmizeImage(file).subscribe((res) => {
    //      const response: any = res;
    //      const base64image = response._body;
    //      data.images.push(base64image);
    //      if (idx === this.files.length - 1) {
            this.employeesService.addEmployee(data);
    //      }
    //    });
    //  });
    //}

  }
/*
  imageFinishedUploading(event) {
    console.log(event, event.file.type);
    if ((event.file.type !== 'image/jpeg' && event.file.type !== 'image/png') || (event.file.size > 1100000)) {
     alert('IMAGEM');
      return;
    }

    this.files.push(event.file);
    console.log(this.files);
  }


  imageRemoved(event) {
    this.files.splice(this.files.indexOf(event.file), 1);
    console.log(this.files);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }*/

}

export interface Permission {
  value: number;
  function: string;
}
