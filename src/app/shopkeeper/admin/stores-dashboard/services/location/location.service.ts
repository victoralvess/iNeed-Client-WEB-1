import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from '../../../../../../environments/environment';
import { ZipCodeAPI } from './zip-code-api.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LocationService {

    public response$ = new Subject<any[]>();

    constructor(private http: Http) {
        this.response$.asObservable().map((responses) => {
            return responses;
        });
    }

    locationByZipCode(zipCode: string, number: string) {
        // tslint:disable-next-line:max-line-length
        this.http.get(`${environment.apis.webmania.url}${zipCode}/?app_key=${environment.apis.webmania.key}&app_secret=${environment.apis.webmania.app_secret}`)
        .map(zipResponse => zipResponse.json())
        .subscribe((zipResponse: ZipCodeAPI) => {

            if (zipResponse.endereco.replace(/\s/g, '').length === 0) {
                this.response$.next(null);
                return;
            } else {
                // tslint:disable-next-line:max-line-length
                this.http.get(`${environment.apis.google.geocoding.url}address=${zipResponse.endereco}, ${number} - ${zipResponse.bairro}, ${zipResponse.cidade} - ${zipResponse.uf}, ${zipResponse.cep}, Brasil&language=pt_BR&key=${environment.apis.google.geocoding.key}`)
                .map(googleResponse => googleResponse.json())
                .subscribe((googleResponse) => {
                    this.response$.next([zipResponse, googleResponse]);
                });
            }
        });
    }
}
