import { Component, ViewChild } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { StoresService } from './services/stores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stores-dashboard',
  templateUrl: './stores-dashboard.component.html',
  styleUrls: ['./stores-dashboard.component.css']
})
export class StoresDashboardComponent {

  displayedColumns = ['name', 'address', 'color', 'actions'];
  dataSource: StoresDataSource;

  constructor(private router: Router, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService) {
    this.dataSource = new StoresDataSource(storesService);
  }

  deleteStore(key) {
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
      }
    });
  }

  updateStore(key) {
    this.router.navigate([`/shopkeeper/dashboard/admin/stores/edit/${key}`]);
  }

}

export class StoresDataSource extends DataSource<any> {

  constructor(private storesService: StoresService) {
    super();
  }

  connect(): Observable<any[]> {
    return this.storesService.getAllStores();
  }

  disconnect() { }
}
