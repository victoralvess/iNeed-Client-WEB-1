import { StoreLocation } from './store-location.model';
import { BusinessTime } from './business-time.interface';

export interface Store {
    name?: string;
    color?: string;
    cnpj?: string;
    description?: string;
    phone?: string;
    cellphone?: string;
    paymentWays?: string[];
    categories?: string[];
    location?: StoreLocation;
    businessTimes?: BusinessTime[];
}
