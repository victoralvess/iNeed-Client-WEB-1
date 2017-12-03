import {Component, OnDestroy, OnInit} from '@angular/core';
import { StoresService } from '../services/stores.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '../models/store.model';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StoreLocation } from '../models/store-location.model';
import { Category } from '../../../models/category.model';
import { Md2Toast } from 'md2';
import { FileHolder } from 'angular2-image-upload';
import { LocationService } from '../services/location/location.service';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { TimeOperationsController } from '../commons/time-operations.controller';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-edit-stores',
    templateUrl: './edit-stores.component.html',
    styleUrls: ['./edit-stores.component.css']
})
export class EditStoresComponent implements OnInit, OnDestroy {

    activatedRouteSubscription;
    storeId;
    fireStore;
    storeSubscription;
    picsUrls = [];
    newFiles = [];
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
    ready = false;
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

    constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private toast: Md2Toast, private locationService: LocationService, private viewContainerRef: ViewContainerRef, private dialogService: TdDialogService, private storesService: StoresService, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title) {
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
                    this.addressReady$.next(false);
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

        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {

            this.storeId = params['storeId'];

            this.fireStore = this.storesService.db.object(`stores/${this.storeId}`);
            this.storeSubscription = this.fireStore.subscribe((foundStore) => {
                console.log('found', foundStore);
                this.picsUrls = [];
                localStorage.setItem(`${this.storeId}/Pictures`, JSON.stringify(foundStore.pictures));
                console.log(foundStore.pictures);
                this.picsUrls = foundStore.pictures;
                this.store.location = foundStore.location;
                /* SETTING DATA IN FIELDS */
                this.storeForm.patchValue({'name': foundStore.name});
                this.storeForm.patchValue({'description': foundStore.description});
                this.storeForm.patchValue({'color': foundStore.color});
                this.storeForm.patchValue({'cnpj': foundStore.cnpj});

                // this.openingClosingForm.patchValue({ 'days': foundStore.businessTimes });
                this.timeOperations.openingClosingArr = (<any[]>foundStore.businessTimes);
                (<any[]>foundStore.businessTimes).forEach((day) => {
                    const index = this.timeOperations.daysOfTheWeek.findIndex((i => i.day === day.day));
                    if (index > -1) {
                        this.timeOperations.daysOfTheWeek[index].checked = true;
                    }
                });

                this.addressForm.patchValue({'street': foundStore.location.parts['street']});
                this.addressForm.patchValue({'zipCode': foundStore.location.parts['zipCode']});
                this.addressForm.patchValue({'number': foundStore.location.parts['number']});
                this.addressForm.patchValue({'city': foundStore.location.parts['city']});
                this.addressForm.patchValue({'state': foundStore.location.parts['state']});
                this.addressForm.patchValue({'vicinity': foundStore.location.parts['vicinity']});

                this.extraInfoForm.patchValue({'mainCategories': foundStore.categories || []});
                this.extraInfoForm.patchValue({'mainPaymentWays': foundStore.paymentWays || []});
                this.extraInfoForm.patchValue({'phone': foundStore.phone || ''});
                this.extraInfoForm.patchValue({'cellphone': foundStore.cellphone || ''});

                this.addressReady$.next(true);
            });
        });

        this.storesService.update$.subscribe((updated) => {
            this.isLoading = false;
            this.snackBar.open('Atualizado!', 'ENTENDI', {
                duration: 5000
            });
            this.router.navigate(['/shopkeeper/dashboard/admin/stores']);
        });
    }

    ngOnInit() {
        this.titleService.setTitle('Atualizar loja');
    }

    ngOnDestroy() {
        this.locationServiceSubscription.unsubscribe();
    }

    imageFinishedUploading(event: FileHolder) {
        if ((event.file.type !== 'image/jpeg' && event.file.type !== 'image/png') || (event.file.size > 1100000)) {
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

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    updateStore(formsValues: any[]) {
        this.isLoading = true;
        const originalPics = JSON.parse(localStorage.getItem(`${this.storeId}/Pictures`));
        if (this.ready) {
            if (this.timeOperations.openingClosingArr.length === 0) {
                this.toast.show('ADICIONE OS HORÁRIOS DE FUNCIONAMENTO');
                return;
            } else {
                this.store.businessTimes = [];
                this.timeOperations.openingClosingArr.forEach((oc) => {
                    this.store.businessTimes.push({
                        day: oc.day,
                        open: oc.openingParsed || oc.open,
                        close: oc.closingParsed || oc.close
                    });
                });
            }
            const storeFormValues = formsValues[0];
            const addressFormValues = formsValues[1];
            const extraInfoFormValues = formsValues[2];
            console.log(formsValues);

            this.store.id = this.storeId;

            this.store.name = storeFormValues.name;
            this.store.description = storeFormValues.description;
            this.store.color = storeFormValues.color;
            this.store.cnpj = storeFormValues.cnpj;

            // this.store.location.parts = {};
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

            if (originalPics) {
                if (this.newFiles.length > 0) {
                    const pictures: string[] = [];
                    this.newFiles.forEach((file, idx, arr) => {
                        this.storesService.optmizeImage(file).subscribe((res) => {
                            const response: any = res;
                            const base64image = response._body;
                            pictures.push(base64image);
                            if (idx === this.newFiles.length - 1) {
                                console.log(this.store);
                                this.storesService.updateStore(this.store, this.picsUrls, originalPics, pictures);
                            }
                        });
                    });
                } else {
                    if (this.picsUrls.length === 0) {
                        this.storesService.updateStore(this.store, originalPics, originalPics);
                    } else {
                        this.storesService.updateStore(this.store, this.picsUrls, originalPics);
                    }
                }
            }
        } else {
            setTimeout(() => {
                this.updateStore(formsValues);
            }, 1000);
        }
    }

    locationByZipCode() {
        this.addressReady$.next(false);
        if (!(this.addressForm.controls['zipCode'].hasError('minlength') || this.addressForm.controls['number'].hasError('minlength'))) {
            const zipCode = this.addressForm.controls['zipCode'].value;
            const number = this.addressForm.controls['number'].value;
            this.locationService.locationByZipCode(zipCode, number);
        }
    }
}
