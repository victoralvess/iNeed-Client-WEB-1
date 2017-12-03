import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import 'rxjs/add/operator/map';
import { FileHolder } from 'angular2-image-upload';
import { User } from 'firebase/app';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-edit-products',
    templateUrl: './edit-products.component.html',
    styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit, OnDestroy {

    user: User;
    productId: any;
    categories: SelectItem[];
    productStore = '';
    dataImagesAux = [];
    activatedRouteSubscription;
    productsSubscription;
    categoriesSubscription;
    products;
    categoriesReady = false;
    picsUrls = [];
    newFiles = [];

    productsForm = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
        description: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(20), CustomValidators.maxLength(200)])),
        price: new FormControl('', Validators.required),
        selectedCategories: new FormControl([], Validators.required),
        upVotes: new FormControl([]),
        downVotes: new FormControl([]),
        upVotesCount: new FormControl(0),
        downVotesCount: new FormControl(0)
    });

    isLoading = false;

    constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private productsService: ProductsService, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title) {

        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

            this.productId = params['productId'];

            this.products = this.productsService.db.object(`products/${this.productId}`);
            this.productsSubscription = this.products.subscribe((foundProduct) => {
                this.picsUrls = [];
                localStorage.setItem(`${this.productId}/Pictures`, JSON.stringify(foundProduct.pictures));
                console.log(foundProduct.pictures);
                this.picsUrls = foundProduct.pictures;
                this.productStore = foundProduct.store;
                if (!foundProduct.downVotes) {
                    foundProduct.downVotes = [];
                }
                if (!foundProduct.upVotes) {
                    foundProduct.upVotes = [];
                }
                this.productsForm = fb.group({
                    name: [foundProduct.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
                    description: [foundProduct.description, Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(200)])],
                    price: [foundProduct.price, Validators.required],
                    selectedCategories: [foundProduct.categories, Validators.required],
                    upVotes: [foundProduct.upVotes],
                    downVotes: [foundProduct.downVotes],
                    upVotesCount: [foundProduct.upVotesCount],
                    downVotesCount: [foundProduct.downVotesCount],
                });
            });
        });

        this.categoriesSubscription = productsService.getAllCategories().subscribe((categories) => {
            const auxArray = [];
            categories.forEach((category) => {
                auxArray.push({label: category.value, value: category.$key});
            });
            this.categories = auxArray;
            this.categoriesReady = true;
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
        this.activatedRouteSubscription.unsubscribe();
        this.productsSubscription.unsubscribe();
        this.categoriesSubscription.unsubscribe();
        localStorage.removeItem(`${this.productId}/Pictures`);
    }

    updateProduct(data) {
        this.isLoading = true;
        const originalPics = JSON.parse(localStorage.getItem(`${this.productId}/Pictures`));
        if (originalPics) {
            data.productId = this.productId;
            data.productStore = this.productStore;
            data.images = [];
            if (this.newFiles.length > 0) {
                this.newFiles.forEach((file, idx, arr) => {
                    this.productsService.optmizeImage(file).subscribe((res) => {
                        const response: any = res;
                        const base64image = response._body;
                        data.images.push(base64image);
                        if (idx === this.newFiles.length - 1) {
                            this.productsService.updateProduct(data, this.picsUrls, originalPics);
                        }
                    });
                });
            } else {
                if (this.picsUrls.length === 0) {
                    this.productsService.updateProduct(data, originalPics, originalPics);
                } else {
                    this.productsService.updateProduct(data, this.picsUrls, originalPics);
                }
            }

            this.router.navigate(['/shopkeeper/dashboard/admin/products']);
        }
    }

    imageFinishedUploading(event: FileHolder) {
        if ((event.file.type !== 'image/jpeg' && event.file.type !== 'image/png') || (event.file.size > 1100000)) {
            this.snackBar.open('Remova as imagens com mais de 1MB. Elas não serão adicionadas!', 'ENTENDI', {
                duration: 5000
            });
            return;
        }

        this.newFiles.push(event.file);
    }

    imageRemoved(event: FileHolder) {
        if (!event.src.startsWith('http')) {
            this.newFiles.splice(this.newFiles.indexOf(event.file), 1);
        } else {
            this.picsUrls.splice(this.picsUrls.indexOf(event.src), 1);
        }
    }

    uploadStateChange(state: boolean) {
        console.log(JSON.stringify(state));
    }
}
