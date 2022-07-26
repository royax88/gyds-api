import { Observable } from 'rxjs/Observable';
import {DynamoDBDataService} from '../data-service/security-data-service';
import logging = require('common-logging');

export class SecurityBusinessService {

    private dynamoDBDataService = new DynamoDBDataService();

    constructor() {

    }

}