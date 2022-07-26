import { Observable } from 'rxjs/Observable';
import { SecurityModel } from '../models/SecurityModel';
import { SecurityBusinessService} from '../business-service/security-business-service';
import logging = require('common-logging');

export class SecurityService {

    private model;
    actioncd: any;
    private securityBusinessService = new SecurityBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {

    }

}
