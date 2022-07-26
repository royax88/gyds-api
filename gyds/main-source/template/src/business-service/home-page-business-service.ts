import { Observable } from 'rxjs/Observable';
import {DynamoDBDataService} from '../data-service/home-page-data-service';
import {EventDemandNoSQLParams} from './nosqlparams';

export class HomePageBusinessService {

    private dynamoDBDataService = new DynamoDBDataService();
    private eventDemandNoSQLParams = new EventDemandNoSQLParams();

    constructor() {

    }

}