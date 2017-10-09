import { ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {

    static minLength(minLength: number): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            console.log('noMinx');
            return ((<string>control.value).replace(/\s/g, '').length < minLength) ? { 'minlength' : { value: control.value } } : null;
        };
    }

    static maxLength(maxLength: number): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            return ((<string>control.value).replace(/\s/g, '').length > maxLength) ? { 'maxlength' : { value: control.value } } : null;
        };
    }

    static rgba2hex(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            let rgba = control.value.toLowerCase();
            const rgbaRegEx: RegExp = /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i;
            if (rgbaRegEx.test(rgba)) {
            rgba = rgba.match(rgbaRegEx);
            let hex = (rgba && rgba.length === 4) ? '#' +
            ('0' + parseInt(rgba[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgba[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgba[3], 10).toString(16)).slice(-2) : '';
            console.log(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex));
            if (hex != null) {
                if (!(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex))) {
                hex = null;
                }
            }

            if (hex != null) {
                control.setValue(hex);
            }
            return (hex == null) ? { 'colorsintax' : { value: control.value } } : null;
            }
        };
    }
}
