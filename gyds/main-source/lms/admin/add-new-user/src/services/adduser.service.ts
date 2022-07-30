import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { AddUserBusinessService} from '../business-service/add-user-business-service';

export class AddUserService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    private addUserBusinessService = new AddUserBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        
        if(process.env['localenv']==="true")
        {
            this.actioncd = event.body.actioncd;
            this.objData = event.body;
        }
        else
        {
            this.actioncd = JSON.parse(event.body).actioncd;
            this.objData = JSON.parse(event.body);
          
        }

        if(this.actioncd=='searchUser')
        {
            console.log("user")
            return this.addUserBusinessService.checkUserInfo();
        }
        if(this.actioncd=='insertNewUser')
        {
            return this.addUserBusinessService.insertIntoUser(this.objData);
        }
    }

}
