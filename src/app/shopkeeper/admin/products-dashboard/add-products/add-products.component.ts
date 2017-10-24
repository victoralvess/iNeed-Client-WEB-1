import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { Message } from 'primeng/primeng';
import { User } from 'firebase/app';
import { Store } from '../../../models/store.model';
import { Category } from '../../../models/category.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {

  stores: Store[] = [];
  categories: SelectItem[] = [];

  productsForm: FormGroup;
  user: User;
  selectedCategories: FormControl[];
  files = [];
  growlMessages: Message[] = [];

  userSubscription;
  categoriesSubscription;

  constructor(private fb: FormBuilder, private productsService: ProductsService) {
    this.productsForm = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
      description: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(20), CustomValidators.maxLength(200)])),
      price: new FormControl('', Validators.required),
      selectedCategories: new FormControl([], Validators.required),
      stores: new FormControl([], Validators.required),
    });

    this.userSubscription = productsService.getStoresWhereUserWorks().subscribe((stores) => {
      stores.forEach(store => {
        this.stores.push({ id: store.$key, name: store.name, address: store.location.address, checked: false });
      });
    });

    this.categoriesSubscription = productsService.getAllCategories().subscribe((categories) => {
      let aux: Category[] = [];
      categories.forEach((category) => {
        aux.push({ label: category.value, value: category.$key });
      });
      this.categories = aux;
    });

  }

  ngOnInit() {

    this.productsService.databaseChanged.asObservable().subscribe((notification) => {
      console.log('foi');
      this.growlMessages.push(notification);
      setTimeout(() => {
        this.growlMessages = [];
      }, 7000)
    });

  }

  ngOnDestroy() {
    console.log('onDestroy');
    this.userSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  addNewProduct(data) {
    console.log(data);

    data.images = [];
    if (this.files.length == 0) {
      this.growlMessages = [{ severity: 'error', summary: 'Erro', detail: 'Adicione alguma imagem (.png, .jpg, .jpeg) antes de continuar!' }];
      setTimeout(() => {
        this.growlMessages = [];
      }, 7000);
      return;
    } else {
      this.files.forEach((file, idx, arr) => {
        this.productsService.optmizeImage(file).subscribe((res) => {
          const response: any = res;
          const base64image = response._body;
          data.images.push(base64image);
          if (idx === this.files.length - 1) {
            this.addProduct(data);
          }
        });
      });
    }
  }

  addProduct(data) {
    console.log(this.stores);

    this.productsService.addProduct(data);
  }

  imageFinishedUploading(event) {
    console.log(event, event.file.type);
    if ((event.file.type !== 'image/jpeg' && event.file.type !== 'image/png') || (event.file.size > 1100000)) {
      this.growlMessages = [{ severity: 'error', summary: 'Erro', detail: 'Remova as imagens com mais de 1MB. Elas não serão adicionadas!' }];
      setTimeout(() => {
        this.growlMessages = [];
      }, 7000);
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
  }
}
