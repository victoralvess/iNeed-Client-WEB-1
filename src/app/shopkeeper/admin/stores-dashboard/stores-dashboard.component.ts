import {Component, OnInit} from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { StoresService } from './services/stores.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-stores-dashboard',
    templateUrl: './stores-dashboard.component.html',
    styleUrls: ['./stores-dashboard.component.css']
})
export class StoresDashboardComponent implements OnInit {

    displayedColumns = ['name', 'address', 'color', 'actions'];
    dataSource: StoresDataSource;

    constructor(public snackBar: MatSnackBar, private db: AngularFireDatabase, private router: Router, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService, private titleService: Title) {
        this.dataSource = new StoresDataSource(storesService);
    }

    ngOnInit(): void {
        this.titleService.setTitle('Lojas');
    }

    deleteStore(key) {
        const user = JSON.parse(localStorage.getItem(`firebase:authUser:${environment.firebase.apiKey}:[DEFAULT]`));
        if (user != null) {
            this.db.object(`users/${user.uid}`)
                .subscribe((currentUser) => {
                    if ((<number>currentUser.permissionLevel) >= 2) {
                        this.dialogService.openConfirm({
                            message: `Você realmente deseja excluir esta loja?`,
                            disableClose: true,
                            viewContainerRef: this.viewContainerRef,
                            title: '',
                            cancelButton: 'Cancelar',
                            acceptButton: 'Excluir',
                        }).afterClosed().subscribe((accept: boolean) => {
                            if (accept) {
                                this.storesService.deleteStore(key);
                                this.snackBar.open('Excluído!', 'ENTENDI', {
                                    duration: 5000
                                });
                            }
                        });
                    } else {
                        this.dialogService.openAlert({
                            message: `Você NÃO tem nível de permissão suficiente para excluir uma loja.`,
                            disableClose: false,
                            viewContainerRef: this.viewContainerRef,
                            title: '',
                            closeButton: 'Entendi'
                        });
                    }
                });
        }
    }

    updateStore(key) {
        this.router.navigate([`/shopkeeper/dashboard/admin/stores/edit/${key}`]);
    }

    feedbacksOf(store) {
        this.router.navigate([`/shopkeeper/dashboard/admin/stores/feedbacks/${store}`]);
    }

}

export class StoresDataSource extends DataSource<any> {

    constructor(private storesService: StoresService) {
        super();
    }

    connect(): Observable<any[]> {
        return this.storesService.getAllStores();
    }

    disconnect() {
    }
}
