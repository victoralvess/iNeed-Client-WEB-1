import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { Message } from 'primeng/primeng';
import * as firebase from 'firebase';

@Component({ 
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {
 categories: SelectItem[] = [{ label : '123', value : '123' }];
  stores = [];
  selectAtLeastOneStore : boolean = true; 
  whitespaceError : boolean = false;
  productsForm : FormGroup;
  storesGroup : FormGroup;
	user : firebase.User;
  selectedCategories: any[];
  files = [];
  growlMessages : Message[] = [];

  constructor(private fb: FormBuilder, private productsService : ProductsService) { 
  	this.productsForm = new FormGroup({
  		name : new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])),
  		description: new FormControl('', Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(200)])),
  		price: new FormControl('', Validators.required),
      selectedCategories: new FormControl([], Validators.required)
    });

    this.storesGroup = new FormGroup({
      storesList: new FormControl('')
    });

    this.productsForm.valueChanges
    .map((value) => {
        value.name = value.name.trim();
        value.description = value.description.trim();
        if(value.name.length < 3 || value.description.length < 20) {
          this.whitespaceError = true;
        } else {
          this.whitespaceError = false;
        } 
        return value;
    });
 
    productsService.getUser().subscribe((user) => {
    	console.log('worksat', user.worksAt);
	   	user.worksAt.forEach(store => {
	   		this.stores.push({id : store, checked : false});
	    });
 		});

    productsService.getAllCategories().subscribe((category) => {
      let auxArray = [];
      category.forEach(cat => {
        auxArray.push({ label : cat.value, value : cat.$key });
      });
      this.categories = auxArray;
     });
  }

  ngOnInit() {}  

  addNewProduct(data) {
    
    if(data.name.trim().length < 3 || data.description.trim().length < 20) {
    	this.whitespaceError = true;
    	return;
    } else {
    	this.whitespaceError = false;
    }

    for(let store of this.stores) {
    	this.selectAtLeastOneStore = store.checked;
    	if(store.checked) {
    		break;
    	}
    }

    if(!this.selectAtLeastOneStore) {
    	return;
    }

    if(this.files.length == 0) {
      this.growlMessages = [{severity: 'error', summary: 'Erro', detail: 'Adicione alguma imagem (.png, .jpg, .jpeg) antes de continuar!'}];  
      setTimeout(() => {
        this.growlMessages = [];
      }, 5000)
      return;
    }

    data.images = this.files;
    console.log(this.files);
    data.stores = this.stores
              		.filter(store => store.checked)
              		.map(store => store.id);

    this.productsService.addProduct(data);

    firebase.database().ref(`/products-stores`).limitToLast(1).on('child_added', (snapshot) => {
      this.growlMessages = [{severity: 'success', summary: 'Sucesso', detail: 'O produto foi cadastrado com êxito!'}];  
      setTimeout(() => {
        this.growlMessages = [];
      }, 5000)
    });
  }
  
  imageFinishedUploading(file) {
    console.log(file, file.file.type);
    if(file.file.type != 'image/jpeg' && file.file.type != 'image/png') {
      return;
    }
    this.files.push(file);  
  }

  imageRemoved(file) {
    this.files.splice(this.files.indexOf(file.src), 1);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  } 
}
