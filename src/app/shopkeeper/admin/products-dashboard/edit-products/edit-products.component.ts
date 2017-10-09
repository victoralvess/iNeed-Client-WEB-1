import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import 'rxjs/add/operator/map';
import { Message } from 'primeng/primeng';

import { User } from 'firebase/app';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {

  whitespaceError : boolean = false;
  productsForm : FormGroup;
  user : User;
  productId : any;
  categories: SelectItem[];
  imagesToShow = [];
  removedImages = [];
  productStore = '';
  picsArray = [];
  hasLessThanLimit : boolean = false;
  upToLimitPics : number;
  picsLimit = 5;
  savedPicsQty = 0;
  filesFromImageUpload = [];
  filesFromImageUploadAux = [];
  activatedRouteSubscription;
  productsSubscription;
  categoriesSubscription;
  products;
  growlMessages : Message[] = [];
  originalPics;

  constructor(private fb: FormBuilder, private productsService : ProductsService, private activatedRoute: ActivatedRoute, private router : Router, private DomSanitizer:DomSanitizer) {

    this.productsForm = new FormGroup({
      name : new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])),
      description: new FormControl('', Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(200)])),
      price: new FormControl('', Validators.required),
      selectedCategories: new FormControl([], Validators.required)
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

    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

      this.productId = params['productId'];

      this.products = this.productsService.db.object(`products/${this.productId}`);
      this.productsSubscription = this.products.subscribe((foundProduct) => {

        this.picsArray = foundProduct.pictures;
        this.savedPicsQty = foundProduct.pictures.length;
        this.originalPics = this.picsArray;

        this.imagesToShow = this.toObjectArray(foundProduct.pictures);
        this.upToLimitPics = this.upToLimitPictures(foundProduct.pictures);
        this.hasLessThanLimit = (this.savedPicsQty < this.picsLimit);

        this.productStore = foundProduct.store;
        console.log('stoooooooooooore',foundProduct);
        console.log('stoooooooooooore',foundProduct.store);
        this.productsForm = fb.group({
          name : [foundProduct.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
          description: [foundProduct.description, Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(200)])],
          price: [foundProduct.price, Validators.required],
          selectedCategories: [foundProduct.categories, Validators.required]
        });
      });
    });

    this.categoriesSubscription = productsService.getAllCategories().subscribe((categories) => {
      let auxArray = [];
      categories.forEach((category) => {
        auxArray.push({ label : category.payload.val().value, value : category.key });
      });
      this.categories = auxArray;
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
    this.activatedRouteSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  dataImagesAux = [];

  updateProduct(data) {

    if(data.name.trim().length < 3 || data.description.trim().length < 20) {
      this.whitespaceError = true;
      return;
    } else {
      this.whitespaceError = false;
    }

    data.productId = this.productId;
    data.productStore = this.productStore;
    data.images = [];

    while(this.filesFromImageUpload.length > this.upToLimitPics){
        this.filesFromImageUploadAux.splice(this.filesFromImageUpload.length - 1, 1);
    }

    let wantsUpdatePics = (this.filesFromImageUpload.length > 0);
    let allRemoved = (this.removedImages.length == this.savedPicsQty);
    if(allRemoved && !wantsUpdatePics) {
      alert('O produto precisa de, pelo menos, 1 imagem. As imagens atuais NÃO foram alteradas');
      this.removedImages.forEach(value => {
        /****************************** P.O.G. ******************************/
        let valAux = value.changingThisBreaksApplicationSecurity || '';
        if(valAux == '') {
          value.changingThisBreaksApplicationSecurity = valAux;
        }
        data.images.push(value.changingThisBreaksApplicationSecurity);
      });
      this.alterProduct(data); 
    } else if(this.hasLessThanLimit && wantsUpdatePics) {
      console.log('less and files');
       this.updatePics(data);      
    } else if((this.removedImages.length > 0)) {
      if(wantsUpdatePics) {
        this.updatePics(data);
      } else {
        data.images = this.originalPics;
        this.alterProduct(data);
      }
    }
  }

  updatePics(data) {
    this.filesFromImageUpload.forEach((file, idx, arr) => {             
      this.productsService.optmizeImage(file).subscribe((res) => {
        let response : any = res;
        let base64image = response._body;
        data.images.push(base64image);
        if(idx == this.filesFromImageUpload.length - 1) {
          if(this.picsArray.length > 0) {
            this.picsArray.forEach(value => {
              data.images.push(value);
            });
          }
          console.log('files', data.images);
          this.alterProduct(data);
        }
      });
    });
  }

  alterProduct(data) {
   this.productsService.updateProduct(data);
   this.router.navigate(['/shopkeeper/dashboard/admin/products']);
  }

  removeImage(image) {

    if(this.toggleRemoveOverlay(image)) {
      this.removedImages.push(image.$value);
      this.picsArray.splice(this.picsArray.indexOf(image.$value), 1);
      this.upToLimitPics++;
    } else {
      this.removedImages.splice(this.removedImages.indexOf(image.$value), 1);
      this.picsArray.push(image.$value);
      this.upToLimitPics--;
    }
    console.log('uptoLimit', this.upToLimitPics);
    this.hasLessThanLimit = (this.upToLimitPics > 0);
  }

  toggleRemoveOverlay(image): boolean {
    image.isRemoved = !image.isRemoved;
    image.overlayText = (image.isRemoved) ? 'Removido' : 'Remover';
    return image.isRemoved;
  }

  upToLimitPictures(arr: any[]): number {
    return  this.picsLimit - arr.length;
  }

  imageFinishedUploading(event) {
    if((event.file.type != 'image/jpeg' && event.file.type != 'image/png') || (event.file.size > 1100000)) {
      this.growlMessages = [{severity: 'error', summary: 'Erro', detail: 'Remova as imagens com mais de 1MB. Elas não serão adicionadas!'}];
      setTimeout(() => {
        this.growlMessages = [];
      }, 7000)
      return;
    }

    console.log('toRemove', event.src);

    this.filesFromImageUpload.push(event.file);
    console.log('toUp', this.filesFromImageUpload);
    console.log('uptoLimit', this.upToLimitPics);
  }

  imageRemoved(event) {
    this.filesFromImageUpload.splice(this.filesFromImageUpload.indexOf(event.file), 1);
    console.log('uptoLimit', this.upToLimitPics);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }

  toObjectArray(arr) : object[] {
    let rv = [];
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] !== undefined) {
        /****************************** P.O.G. ******************************/
        let val = arr[i];
        let valAux = val.changingThisBreaksApplicationSecurity || '';
        if(valAux != '') {
          val = valAux;
        }
        rv.push({
          $key : i,
          $value : this.DomSanitizer.bypassSecurityTrustUrl(val),
          isRemoved : false,
          overlayText: 'Remover'
        });
      }
    }
    return rv;
  }
}
