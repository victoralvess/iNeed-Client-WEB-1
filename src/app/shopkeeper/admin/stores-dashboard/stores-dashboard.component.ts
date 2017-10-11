import { Component, OnInit } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { StoresService } from './services/stores.service';

@Component({
  selector: 'app-stores-dashboard',
  templateUrl: './stores-dashboard.component.html',
  styleUrls: ['./stores-dashboard.component.css']
})
export class StoresDashboardComponent implements OnInit {

  displayedColumns = ['name', 'address', 'color'];

  constructor(private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService) { }

  ngOnInit() {
    // this.deleteStore('a', 'b');
  }

  deleteStore(key, picsQty) {
    this.dialogService.openConfirm({
      message: `Você realmente deseja excluir esta loja?`,
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
      title: '',
      cancelButton: 'Cancelar',
      acceptButton: 'Excluir',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {

      }
    });
  }

}

export class StoresDataSource extends DataSource<any> {

  storesList: any[];

  constructor(private storesService: StoresService) {
    super();
    // this.storesList = this.storesService.
  }

  connect(): Observable<any[]> {
    return Observable.of(this.storesList);
  }

  disconnect() {}
}
