import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Store } from '../../../models/store.model';
import { EmployeesService } from '../services/employees.service';
import { Subscription } from 'rxjs/Subscription';
import { Permission } from '../models/permission.interface';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-add-employees',
    templateUrl: './add-employees.component.html',
    styleUrls: ['./add-employees.component.css']
})
export class AddEmployeesComponent implements OnInit, OnDestroy {

    employeeForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
        email: new FormControl('', Validators.compose([Validators.required])),
        password: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(8), CustomValidators.maxLength(22)])),
        permissionLevel: new FormControl('', Validators.required),
        stores: new FormControl([], Validators.required)
    });

    permissions: Permission[] = [
        {
            value: 1,
            function: 'Pode gerenciar feedbacks'
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
    isLoading = false;

    userSnackBar = {messageSuccess: 'Funcionário adicionado!', messageError: 'Erro ao adicionar'};


    constructor(public snackBar: MatSnackBar, private employeesService: EmployeesService, private router: Router, private titleService: Title) {
        this.userSubscription = employeesService.getStoresWhereUserWorks().subscribe((stores) => {
            stores.forEach(store => {
                this.stores.push({id: store.$key, name: store.name, address: store.location.address, checked: false});
            });
        });

        this.employeesService.signUp$.subscribe((signedUp) => {
            this.isLoading = false;
            if (signedUp) {
                this.snackBar.open(this.userSnackBar.messageSuccess, 'ENTENDI', {
                    duration: 5000
                });
                this.router.navigate(['/shopkeeper/dashboard/admin/employees']);
            } else {
                this.snackBar.open(this.userSnackBar.messageError, 'ENTENDI', {
                    duration: 5000
                });
            }
        });
    }

    ngOnInit() {
        this.titleService.setTitle('Adicionar Funcionário');
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }

    addEmployee(data) {
        this.isLoading = true;
        let stores = '';
        (<any[]>data.stores).forEach((store, i) => {
            if (i !== (<any[]>data.stores).length - 1) {
                stores += (store + '|');
            } else {
                stores += (store);
            }
        });
        data.stores = stores;
        this.employeesService.addEmployee(data);
    }
}
