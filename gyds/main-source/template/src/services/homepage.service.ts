import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { HomePageBusinessService} from '../business-service/home-page-business-service';

export class HomePageService {

    private model;
    actioncd: any;
    private homePageBusinessService = new HomePageBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {

    }

}
