import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {

  whitespaceError : boolean = false;
  productsForm : FormGroup;
	user : firebase.User;
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


  constructor(private fb: FormBuilder, private productsService : ProductsService, private activatedRoute: ActivatedRoute, private router : Router) { 

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

    this.activatedRoute.params.subscribe((params: Params) => {

      this.productId = params['productId'];

  		this.productsService.db.object(`products/${this.productId}`)
      .subscribe((foundProduct) => {

        this.picsArray = foundProduct.pictures;
        this.savedPicsQty = foundProduct.pictures.length;

        this.imagesToShow = this.toObjectArray(foundProduct.pictures);
        this.upToLimitPics = this.upToLimitPictures(foundProduct.pictures);
        this.hasLessThanLimit = (this.savedPicsQty < this.picsLimit);

        this.productStore = foundProduct.store;
  			this.productsForm = fb.group({
		  		name : [foundProduct.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
		  		description: [foundProduct.description, Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(200)])],
		  		price: [foundProduct.price, Validators.required],
          selectedCategories: [foundProduct.categories, Validators.required]
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

  ngOnInit() { }

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

    if(this.picsArray.length > 0) {
      data.images = this.picsArray;
    } else if(this.removedImages.length == this.savedPicsQty) {
      alert('O produto precisa de, pelo menos, 1 imagem. As imagens atuais NÃO foram alteradas');
      data.images = this.removedImages;
    }

    if(this.hasLessThanLimit && this.filesFromImageUpload.length > 0) {
      data.images = data.images.concat(this.filesFromImageUpload);
    }

   this.productsService.updateProduct(data);

   this.router.navigate(['/shopkeeper/dashboard/admin/products/']);
  }
 
  removeImage(image) {
    let key = image.$key;

    if(this.toggleRemoveOverlay(image)) {
      this.removedImages.push(image.$value);
      this.picsArray.splice(this.picsArray.indexOf(image.$value), 1);
      this.upToLimitPics++;
    } else {   
      this.removedImages.splice(this.removedImages.indexOf(image.$value), 1);
      this.picsArray.push(image.$value);
      this.upToLimitPics--;
    }    

    this.hasLessThanLimit = (this.upToLimitPics > 0);
  }

  toggleRemoveOverlay(image) : boolean {
    image.isRemoved = !image.isRemoved;
    image.overlayText=(image.isRemoved)?'Removido':'Remover'
    return image.isRemoved;
  }

  upToLimitPictures(arr : any[]) : number {
    return  this.picsLimit - arr.length;
  }

  imageFinishedUploading(file) {
    if(file.file.type != 'image/jpeg' && file.file.type != 'image/png') {
      return;
    }
    console.log('toRemove', file.src);
    this.filesFromImageUpload.push(file.src);  
  }

  imageRemoved(file) {
    this.filesFromImageUpload.splice(this.filesFromImageUpload.indexOf(file.src), 1);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  } 

  toObjectArray(arr) : object[] {
    let rv = [];
    for (let i = 0; i < arr.length; ++i) {    
      if (arr[i] !== undefined) {
        rv.push({
          $key : i,
          $value : arr[i],
          isRemoved : false,
          overlayText: 'Remover'
        });
      }
    }
    return rv;
  }
}
