import { Component, OnInit, OnDestroy } from '@angular/core';

import { EmployeesService } from './services/employees.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Permission } from './models/permission.interface';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-employees-dashboard',
    templateUrl: './employees-dashboard.component.html',
    styleUrls: ['./employees-dashboard.component.css']
})
export class EmployeesDashboardComponent implements OnInit, OnDestroy {

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

    displayedColumns = ['name', 'email', 'permission', 'actions'];
    dataSource: EmployeesDataSource;
    stores = [];
    userSubscription;
    lastSelected;
    employees$ = new Subject<any>();
    employees;

    constructor(public snackBar: MatSnackBar, private router: Router, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private employeesService: EmployeesService, private titleService: Title) {
        this.employees$.asObservable().subscribe((storeId) => {
            this.dataSource = new EmployeesDataSource(employeesService, storeId);
        });

        this.userSubscription = employeesService.getStoresWhereUserWorks().subscribe((stores) => {
            this.stores = stores;
            this.lastSelected = this.stores[0].$key;
            this.employees$.next(this.lastSelected);
        });
    }

    ngOnInit() {
        this.titleService.setTitle('Funcionários');
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }

    deleteEmployee(key, permissionLevel) {
        if ((<number>permissionLevel) !== 4 && (<string>key) !== this.employeesService.user.uid) {
            this.dialogService.openConfirm({
                message: `Você realmente deseja excluir este funcionário?`,
                disableClose: true,
                viewContainerRef: this.viewContainerRef,
                title: '',
                cancelButton: 'Cancelar',
                acceptButton: 'Excluir',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    this.employeesService.deleteEmployee(key);
                    this.snackBar.open('Excluído do sistema', 'ENTENDI', {
                        duration: 5000
                    });
                }
            });
        } else if ((<string>key) === this.employeesService.user.uid || (<number>permissionLevel) === 4) {
            this.youShallNotPass();
        }
    }

    deleteEmployeeFromStore(key, permissionLevel) {
        if ((<number>permissionLevel) !== 4 && (<string>key) !== this.employeesService.user.uid) {
            this.dialogService.openConfirm({
                message: `Você realmente deseja retirar o acesso deste funcionário desta loja?`,
                disableClose: true,
                viewContainerRef: this.viewContainerRef,
                title: '',
                cancelButton: 'Cancelar',
                acceptButton: 'Confirmar',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    this.employeesService.deleteEmployee(key, this.lastSelected);
                    this.snackBar.open('Removido da loja', 'ENTENDI', {
                        duration: 5000
                    });
                }
            });
        } else if ((<string>key) === this.employeesService.user.uid || (<number>permissionLevel) === 4) {
            this.youShallNotPass();
        }
    }

    updateEmployee(key, permissionLevel) {
        if ((<number>permissionLevel) !== 4 && (<string>key) !== this.employeesService.user.uid) {
            this.router.navigate([`/shopkeeper/dashboard/admin/employees/edit/${key}`]);
        } else if ((<string>key) === this.employeesService.user.uid || (<number>permissionLevel) === 4) {
            this.youShallNotPass();
        }
    }

    onChange(value) {
        this.lastSelected = value;
        this.employees$.next(this.lastSelected);
    }

    youShallNotPass() {
        this.snackBar.open('Não permitido', 'ENTENDI', {
            duration: 5000
        });
    }

}

export class EmployeesDataSource extends DataSource<any> {

    constructor(private employeesService: EmployeesService, private storeId) {
        super();
    }

    connect(): Observable<any[]> {
        return this.employeesService.getEmployeesFrom(this.storeId);
    }

    disconnect() {
    }
}
