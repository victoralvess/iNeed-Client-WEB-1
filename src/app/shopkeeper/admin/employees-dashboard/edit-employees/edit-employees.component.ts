import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '../../../models/store.model';
import { EmployeesService } from '../services/employees.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Permission } from '../models/permission.interface';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-edit-employees',
    templateUrl: './edit-employees.component.html',
    styleUrls: ['./edit-employees.component.css']
})
export class EditEmployeesComponent implements OnInit, OnDestroy {
    employeeForm: FormGroup = new FormGroup({
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
    activatedRouteSubscription;
    employeeId;
    name;
    email;
    employeeWorksAt = [];
    bossWorksAt = [];
    nonEditableStores = [];
    storesHack$ = new Subject<any[]>();
    callHack = 0;
    employeeStoresSubscription;

    isLoading = false;
    userSnackBar = {messageSuccess: 'Atualizado com sucesso!', messageError: 'Erro ao atualizar'};


    constructor(public snackBar: MatSnackBar, private employeesService: EmployeesService, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title) {
        this.storesHack$.asObservable().subscribe((storesArray) => {

            this.callHack++;
            if (storesArray[0].length > 0 && storesArray[1].length > 0 && this.callHack === 2) {
                storesArray[1].forEach((nonEditable) => {
                    const diff = storesArray[0].findIndex(i => i.id === nonEditable.id);
                    if (diff > -1) {
                        this.nonEditableStores.splice(diff, 1);
                        storesArray[1].splice(diff, 1);
                    }
                });
            }
        });
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

            this.employeeId = params['employeeId'];
            employeesService.db.object(`users/${this.employeeId}`).subscribe((employee) => {

                this.name = employee.name;
                this.email = employee.email;
                this.employeeForm.patchValue({permissionLevel: employee.permissionLevel});
                this.employeeStoresSubscription = employeesService.getStoresWhereEmployeeWorks(this.employeeId).subscribe((stores) => {
                    const employeeWorksAtList = [];
                    stores.forEach(store => {
                        employeeWorksAtList.push(store.$key);
                        this.nonEditableStores.push({
                            id: store.$key,
                            name: store.name,
                            address: store.location.address,
                            checked: true
                        });
                    });
                    this.employeeWorksAt = employeeWorksAtList;
                    this.storesHack$.next([this.stores, this.nonEditableStores]);
                    this.employeeForm.patchValue({stores: employeeWorksAtList});
                    console.log(employee, stores);
                });
            });

            this.userSubscription = employeesService.getStoresWhereUserWorks().subscribe((stores) => {
                stores.forEach(store => {
                    this.stores.push({
                        id: store.$key,
                        name: store.name,
                        address: store.location.address,
                        checked: false
                    });
                });
                this.storesHack$.next([this.stores, this.nonEditableStores]);
                this.bossWorksAt = this.stores;
            });
        });

        this.employeesService.update$.subscribe((updated) => {
            this.isLoading = false;
            if (updated) {
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
        this.titleService.setTitle('Atualizar Funcionário');
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
        this.employeeStoresSubscription.unsubscribe();
        this.activatedRouteSubscription.unsubscribe();
    }

    updateEmployee(data) {
        this.isLoading = true;
        data.employeeId = this.employeeId;
        data.previousStoresIds = this.employeeWorksAt;
        const bossWorksAtIds = {};
        this.bossWorksAt.forEach((store) => {
            bossWorksAtIds[store.id] = store.id;
        });

        const cannotUpdate = this.employeeWorksAt.filter((store) => {
            return !(store in bossWorksAtIds);
        });

        cannotUpdate.forEach((id) => {
            if (data.stores.indexOf(id) < 0) {
                data.stores.push(id);
            }
        });
        console.log(data);
        this.userSubscription.unsubscribe();
        this.employeeStoresSubscription.unsubscribe();
        this.activatedRouteSubscription.unsubscribe();
        this.employeesService.updateEmployee(data);
    }
}
