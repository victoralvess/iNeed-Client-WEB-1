import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { User } from 'firebase/app';
import { Store } from '../../../models/store.model';
import { Category } from '../../../models/category.model';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-add-products',
    templateUrl: './add-products.component.html',
    styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit, OnDestroy {

    stores: Store[] = [];
    categories: SelectItem[] = [];

    productsForm: FormGroup;
    user: User;
    selectedCategories: FormControl[];
    files = [];

    userSubscription;
    categoriesSubscription;
    isLoading = false;

    constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private productsService: ProductsService, private titleService: Title) {
        this.productsForm = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
            description: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(20), CustomValidators.maxLength(200)])),
            price: new FormControl('', Validators.required),
            selectedCategories: new FormControl([], Validators.required),
            stores: new FormControl([], Validators.required),
        });

        this.userSubscription = productsService.getStoresWhereUserWorks().subscribe((stores) => {
            stores.forEach(store => {
                this.stores.push({id: store.$key, name: store.name, address: store.location.address, checked: false});
            });
        });

        this.categoriesSubscription = productsService.getAllCategories().subscribe((categories) => {
            const aux: Category[] = [];
            categories.forEach((category) => {
                aux.push({label: category.value, value: category.$key});
            });
            this.categories = aux;
        });

    }

    ngOnInit() {
        this.titleService.setTitle('Adicionar Produto');

        this.productsService.databaseChanged.asObservable().subscribe((notification) => {
            this.isLoading = false;
            this.snackBar.open(notification.detail, 'ENTENDI', {
                duration: 5000
            });
        });

    }

    ngOnDestroy() {
        console.log('onDestroy');
        this.userSubscription.unsubscribe();
        this.categoriesSubscription.unsubscribe();
    }

    addNewProduct(data) {
        this.isLoading = true;
        console.log(data);

        data.images = [];
        if (this.files.length === 0) {
            this.isLoading = false;
            this.snackBar.open('Adicione alguma imagem (.png, .jpg, .jpeg) antes de continuar!', 'ENTENDI', {
                duration: 5000
            });
            return;
        } else {
            this.isLoading = true;
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
            this.snackBar.open('Remova as imagens com mais de 1MB. Elas não serão adicionadas!', 'ENTENDI', {
                duration: 5000
            });
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
