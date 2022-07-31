import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { ManageConfigBusinessService} from '../business-service/manage-config-business-service';

export class ManageConfigService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
    private manageConfigBusinessService = new ManageConfigBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        
        if(process.env['localenv']==="true")
        {
            this.actioncd = event.body.actioncd;
        }
        else
        {
            this.actioncd = JSON.parse(event.body).actioncd;
          
        }

        if(this.actioncd=='getConfig')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getConfigValules(this.name);
        }
        else if(this.actioncd=='getConfigByName')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getConfigByName(this.name);
        }
    }

}