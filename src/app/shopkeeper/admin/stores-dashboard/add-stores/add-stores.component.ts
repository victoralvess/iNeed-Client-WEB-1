import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { Md2Toast } from 'md2';
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
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { TimeOperationsController } from '../commons/time-operations.controller';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-add-stores',
    templateUrl: './add-stores.component.html',
    styleUrls: ['./add-stores.component.scss']
})
export class AddStoresComponent implements OnInit, OnDestroy {

    cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    zipCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
    phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    cellphoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    cellphoneValidator: RegExp = /\(\d\d\)\ \d\ \d\d\d\d\-\d\d\d\d/;
    phoneValidator: RegExp = /\(\d\d\)\ \d\d\d\d\-\d\d\d\d/;

    files: File[] = [];
    store: Store = {};

    step = 0;
    locationServiceSubscription: Subscription;
    addressReady$ = new Subject<any>();
    ready;
    categoriesReady = false;
    categoriesSubscription: Subscription;
    categories = [];
    paymentMethods = [
        {label: 'Dinheiro', value: 'money'},
        {label: 'Boleto', value: 'payment-slip'},
        {label: 'PayPal', value: 'paypal'},
        {label: 'Cartão de Débito', value: 'debit'},
        {label: 'Cartão de Crédito', value: 'credit'},
        {label: 'Cheque', value: 'check'},
        {label: 'Bitcoin', value: 'bitcoin'}
    ];

    storeForm = new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(45)])),
        cnpj: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(18)])),
        color: new FormControl('#3F51B5', CustomValidators.rgba2hex()),
        description: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(10), CustomValidators.maxLength(200)]))
    });

    openingClosingForm = new FormGroup({
        days: new FormControl([])
    });

    addressForm = new FormGroup({
        street: new FormControl(''),
        zipCode: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(9)])),
        number: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(1)])),
        city: new FormControl(''),
        state: new FormControl(''),
        vicinity: new FormControl(''),
    });

    extraInfoForm = new FormGroup({
        mainCategories: new FormControl([]),
        mainPaymentWays: new FormControl([]),
        phone: new FormControl(''),
        cellphone: new FormControl('')
    });

    isLoading = false;

    timeOperations: TimeOperationsController;

    constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private toast: Md2Toast, private locationService: LocationService, private storesService: StoresService, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private router: Router, private titleService: Title) {
        this.timeOperations = new TimeOperationsController(dialog, viewContainerRef, dialogService);
        this.addressReady$.asObservable().subscribe((isReady) => {
            this.ready = isReady;
        });

        this.locationServiceSubscription = this.locationService.response$.asObservable().subscribe((responses) => {
            if (responses === null) {
                this.addressForm.controls['zipCode'].setValue('');
                this.addressForm.controls['zipCode'].setErrors({'required': true});
            } else {
                this.addressForm.controls['street'].setValue(responses[0].endereco);
                this.addressForm.controls['city'].setValue(responses[0].cidade);
                this.addressForm.controls['vicinity'].setValue(responses[0].bairro);
                this.addressForm.controls['state'].setValue(responses[0].uf);

                console.log(responses[1]);
                if (responses[1].status === 'OK') {
                    const storeLocation: StoreLocation = {};
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
                        closeButton: 'ENTENDI'
                    });
                }
            }
        });

        this.categoriesSubscription = storesService.getAllCategories().subscribe((categories) => {
            const aux: Category[] = [];
            categories.forEach((category) => {
                aux.push({label: category.value, value: category.$key});
            });
            this.categories = aux;
            this.categoriesReady = true;
        });

        this.storesService.update$.subscribe((updated) => {
            this.isLoading = false;
            this.snackBar.open('Loja adicionada!', 'ENTENDI', {
                duration: 5000
            });
            this.router.navigate(['/shopkeeper/dashboard/admin/stores']);
        });
    }

    ngOnInit(): void {
        this.titleService.setTitle('Adicionar loja');
    }

    ngOnDestroy() {
        this.addressReady$.unsubscribe();
        this.locationServiceSubscription.unsubscribe();
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
        this.isLoading = true;
        if (this.ready) {
            if (this.timeOperations.openingClosingArr.length === 0) {
                this.toast.show('ADICIONE OS HORÁRIOS DE FUNCIONAMENTO');
                return;
            } else {
                this.store.businessTimes = [];
                this.timeOperations.openingClosingArr.forEach((oc) => {
                    this.store.businessTimes.push({day: oc.day, open: oc.openingParsed, close: oc.closingParsed});
                });
            }
            const storeFormValues = formsValues[0];
            const addressFormValues = formsValues[1];
            const extraInfoFormValues = formsValues[2];
            console.log(formsValues);

            this.store.name = storeFormValues.name;
            this.store.description = storeFormValues.description;
            this.store.color = storeFormValues.color;
            this.store.cnpj = storeFormValues.cnpj;

            this.store.location.parts = {};
            this.store.location.parts['street'] = addressFormValues.street;
            this.store.location.parts['zipCode'] = (addressFormValues.zipCode);
            this.store.location.parts['number'] = addressFormValues.number;
            this.store.location.parts['city'] = addressFormValues.city;
            this.store.location.parts['state'] = addressFormValues.state;
            this.store.location.parts['vicinity'] = addressFormValues.vicinity;

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
                const pictures: string[] = [];
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
            this.snackBar.open('Remova as imagens com mais de 1MB. Elas não serão adicionadas!', 'ENTENDI', {
                duration: 5000
            });
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
