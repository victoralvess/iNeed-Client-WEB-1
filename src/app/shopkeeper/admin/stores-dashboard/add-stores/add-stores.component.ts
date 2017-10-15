import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Md2Colorpicker, Md2Toast } from 'md2';
import { FileHolder } from 'angular2-image-upload';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { LocationService } from '../services/location/location.service';
import { StoresService } from '../services/stores.service';
import { Store } from '../models/store.model';
import { StoreLocation } from '../models/store-location.model';
import { Category } from '../../../models/category.model';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-add-stores',
  templateUrl: './add-stores.component.html',
  styleUrls: ['./add-stores.component.scss']
})
export class AddStoresComponent implements OnDestroy {

  private cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  private zipCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  private phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  private cellphoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  private cellphoneValidator: RegExp = /\(\d\d\)\ \d\ \d\d\d\d\-\d\d\d\d/;
  private phoneValidator: RegExp = /\(\d\d\)\ \d\d\d\d\-\d\d\d\d/;

  private files: File[] = [];
  private store: Store = {};

  private step = 0;

  private addressReady$ = new Subject<any>();
  private ready;
  private categoriesReady = false;
  private categoriesSubscription: Subscription;
  private categories = [];

  private storeForm = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(45)])),
    cnpj: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(18)])),
    color: new FormControl('#3F51B5', CustomValidators.rgba2hex()),
    description: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(10), CustomValidators.maxLength(200)
    ]))
  });

  private addressForm = new FormGroup({
    street: new FormControl(''),
    zipCode: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(9)])),
    number: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(1)])),
    city: new FormControl(''),
    state: new FormControl(''),
    vicinity: new FormControl(''),
  });

  private extraInfoForm = new FormGroup({
    mainCategories: new FormControl([]),
    mainPaymentWays: new FormControl([]),
    phone: new FormControl(''),
    cellphone: new FormControl('')
  });

  constructor(private toast: Md2Toast, private locationService: LocationService, private storesService: StoresService, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService) {
    this.addressReady$.asObservable().subscribe((isReady) => {
      this.ready = isReady;
    });

    this.locationService.response$.asObservable().subscribe((responses) => {
      if (responses === null) {
        this.addressForm.controls['zipCode'].setValue('');
        this.addressForm.controls['zipCode'].setErrors({ 'required': true });
      } else {
        this.addressForm.controls['street'].setValue(responses[0].endereco);
        this.addressForm.controls['city'].setValue(responses[0].cidade);
        this.addressForm.controls['vicinity'].setValue(responses[0].bairro);
        this.addressForm.controls['state'].setValue(responses[0].uf);

        console.log(responses[1]);
        if (responses[1].status === 'OK') {
          let storeLocation: StoreLocation = {};
          storeLocation.lat = responses[1].results[0].geometry.location.lat;
          storeLocation.lng = responses[1].results[0].geometry.location.lng;
          storeLocation.address = responses[1].results[0].formatted_address;
          this.store.location = storeLocation;
          this.addressReady$.next(true);
        } else {
          this.dialogService.openAlert({
            message: 'Esse endereço não foi encontrado com precisão nas nossas bases de dados. Infelizmente o cadastro não poderá ser efetuado com esse endereço.',
            disableClose: true,
            viewContainerRef: this.viewContainerRef,
            title: 'Erro',
            closeButton: 'ENTENDI',
          });
        }
      }
    });

    this.categoriesSubscription = storesService.getAllCategories().subscribe((categories) => {
      let aux: Category[] = [];
      categories.forEach((category) => {
        aux.push({ label: category.value, value: category.$key });
      });
      this.categories = aux;
      this.categoriesReady = true;
    });
  }

  ngOnDestroy() {
    this.addressReady$.unsubscribe();
    this.locationService.response$.unsubscribe();
  }

  locationByZipCode() {
    this.addressReady$.next(false);
    if (!(this.addressForm.controls['zipCode'].hasError('minlength') || this.addressForm.controls['number'].hasError('minlength'))) {
      const zipCode = this.addressForm.controls['zipCode'].value;
      const number = this.addressForm.controls['number'].value;
      this.locationService.locationByZipCode(zipCode, number);
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  addStore(formsValues: any[]) {
    if (this.ready) {
      const storeFormValues = formsValues[0];
      const addressFormValues = formsValues[1];
      const extraInfoFormValues = formsValues[2];
      console.log(formsValues);

      this.store.name = storeFormValues.name;
      this.store.description = storeFormValues.description;
      this.store.color = storeFormValues.color;
      this.store.cnpj = storeFormValues.cnpj;

      if (this.phoneValidator.test(<string>extraInfoFormValues.phone)) {
        this.store.phone = extraInfoFormValues.phone;
      }

      if (this.cellphoneValidator.test(<string>extraInfoFormValues.cellphone)) {
        this.store.cellphone = extraInfoFormValues.cellphone;
      }

      if ((<any[]>extraInfoFormValues.mainPaymentWays).length > 0) {
        this.store.paymentWays = extraInfoFormValues.mainPaymentWays;
      }

      if ((<any[]>extraInfoFormValues.mainCategories).length > 0) {
        this.store.categories = extraInfoFormValues.mainCategories;
      }

      if (this.files.length === 0) {
        this.toast.toast('Adicione alguma imagem (.png, .jpg, .jpeg) antes de continuar!');
        return;
      } else {
        let pictures: string[] = [];
        this.files.forEach((file, idx, arr) => {
          this.storesService.optmizeImage(file).subscribe((res) => {
            const response: any = res;
            const base64image = response._body;
            pictures.push(base64image);
            if (idx === this.files.length - 1) {
              console.log(this.store);
              this.storesService.addStore(this.store, pictures);
            }
          });
        });
      }
    } else {
      setTimeout(() => {
        this.addStore(formsValues);
      }, 1000);
    }
  }

  imageFinishedUploading(event: FileHolder) {
    console.log(event, event.file.type);
    if ((event.file.type !== 'image/jpeg' && event.file.type !== 'image/png') || (event.file.size > 1100000)) {
      this.toast.toast('Remova as imagens com mais de 1MB. Elas não serão adicionadas!');
      return;
    }

    this.files.push(event.file);
    console.log(this.files);
  }


  imageRemoved(event: FileHolder) {
    this.files.splice(this.files.indexOf(event.file), 1);
    console.log(this.files);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }
}
