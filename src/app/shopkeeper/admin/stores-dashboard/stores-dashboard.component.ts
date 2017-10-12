import { Component, OnInit } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { StoresService } from './services/stores.service';
import { ITdDataTableColumn, TdDataTableTableComponent } from '@covalent/core';

@Component({
  selector: 'app-stores-dashboard',
  templateUrl: './stores-dashboard.component.html',
  styleUrls: ['./stores-dashboard.component.css']
})
export class StoresDashboardComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'name',  label: 'Nome'},
    { name: 'address', label: 'Endereço'},
    { name: 'color', label: 'Cor'}
  ];

  basicData: StoreTableData[] = [];

  constructor(private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService) { 

  }

  refreshTable(event) {
    console.log('refresh', event);
  }

  ngOnInit() {
    // this.deleteStore('a', 'b');
    this.storesService.stores$.asObservable().subscribe((stores) => {
      console.log('all', stores);
      stores.forEach((store, index) => {
        console.log('estive_AQUI');
        store.subscribe((s) => {
          this.basicData.push({key: s.$key, name: s.name, address: s.location.address, color: s.color, picturesLength: s.pictures.length});
        });
      });
    });
    this.storesService.getAllStores();
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

export interface StoreTableData {
  name: string;
  color: string;
  address: string;
  key: string;
  picturesLength: number;
}
