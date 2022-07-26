import { Observable } from 'rxjs/Observable';
import { SecurityModel } from '../models/SecurityModel';
import { SecurityBusinessService} from '../business-service/security-business-service';

export class SecurityService {

    private model;
    actioncd: any;
    username: any;
    password: any;
    private securityBusinessService = new SecurityBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        
        if(process.env['localenv']==="true")
        {
            this.actioncd = event.body.actioncd;
            this.username = event.body.username;
            this.password = event.body.password;
        }
        else
        {
            this.actioncd = JSON.parse(event.body).actioncd;
            this.username = JSON.parse(event.body).username;
            this.password = JSON.parse(event.body).password;
        }
        console.log("events", event)
        if(this.actioncd=='getsecurityobject')
        {
            return this.securityBusinessService.checkUserInfo(this.username, this.password);
        }

    }

}
