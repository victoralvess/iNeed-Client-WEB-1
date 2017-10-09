import { Component, OnInit } from '@angular/core';

import { EmployeesService } from './services/employees.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { PaginationInstance } from 'ngx-pagination';

import { Modal } from 'ngx-modialog/plugins/bootstrap/bundle/ngx-modialog-bootstrap';

import { Subject } from 'rxjs/Subject'; 

@Component({
  selector: 'app-employees-dashboard',
  templateUrl: './employees-dashboard.component.html',
  styleUrls: ['./employees-dashboard.component.css']
})
export class EmployeesDashboardComponent implements OnInit {
/*
	stores : any[];
	employees;
	user : firebase.User;
  query : any;
  currentPage = 1;
  userSubscription;
  employeesSubscription;
  lastSelected;
  employeesSubject;

  public paginationComponentConfig: PaginationInstance = {
    id: 'employees-pagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private router : Router, private employeesService : EmployeesService, private modal : Modal) { 
		this.employeesSubject = new Subject<string>();
		this.employeesSubject.asObservable().subscribe((storeId) => {
  		this.getEmployees(storeId);
  	});

    this.userSubscription = employeesService.getUser().subscribe((user) => {
      this.stores = user.worksAt;
      this.lastSelected = this.stores[0].storeId;      
      this.employeesSubject.next(this.lastSelected); 
    });
     console.log(this.bindPermissionLevel('1'));
  } 	
*/
  ngOnInit() { }
/*
  ngOnDestroy() {
    console.log('onDestroy');
    this.employees.subscribe().unsubscribe();
    this.userSubscription.unsubscribe();
    this.employeesSubscription.unsubscribe();
    
  }  

  onChange(value) {
    this.lastSelected = value;   
    this.employeesSubject.next(this.lastSelected);
  }

  getEmployees(storeId) {    
    this.employees = this.employeesService.getEmployeesFrom(storeId);
    this.updateEmployeesSubscription();
  }

  updateEmployeesSubscription() {    
    this.employeesSubscription = this.employees.subscribe();
  }

  addNewEmployee() {
    this.router.navigate(['/shopkeeper/dashboard/admin/employees/add']);
  }

  deleteEmployee(key, categories, store) {
  	console.log('delete', key);
  	console.log('delete', categories);
  	console.log('delete', store);
    const deleteModal = this.modal.confirm()
                      .size('lg')
                      .showClose(false)
                      .keyboard(27)
                      .title('Excluir dados')
                      .body(`
                          <div class="alert alert-danger">
                            <b><span class="material-icons">warning</span> O funcionário será desassociado somente de ${this.stores[this.lastSelected].storeName} - ${this.stores[this.lastSelected].storeAddress} (permanentemente).</b>
                          </div>
                          <p>Você realmente deseja desassociá-lo desta loja?</p>
                          `)
                      .cancelBtn('CANCELAR')
                      .okBtn('EXCLUIR')
                      .okBtnClass('btn btn-danger')
                      .open();

    deleteModal.then((dialogRef) => {
      dialogRef.result.then((result) => {
        if(result) {
          this.employeesService.deleteEmployee(key, categories, store);
        }
      }).catch((err) => {
        
      });
    });
    
  }

  bindPermissionLevel(level: string) {
  	let pLevel : number = Number.parseInt(level);
  	switch (pLevel) {
  		case 1:
  			return 'Visualizar Produtos / Ler e Responder Feedbacks';

  		case 2:
  			return 'Visualizar e Gravar Produtos / Ler e Responder Feedbacks';

  		case 3:
  			return 'Visualizar e Gravar Novos Usuários e Produtos / Ler e Responder Feedbacks';
  	}
  }*/
}
