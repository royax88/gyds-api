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
        console.log("event", event);
        // Validate event and body
        if (!event || !event.body) {
            return Observable.create((observer) => {
                observer.error({
                    message: "Invalid event or missing body",
                    statusCode: 400
                });
            });
        }

        try {
            // Always parse the JSON body since event.body is always a string
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            this.actioncd = body.actioncd;
            this.username = body.username;
            this.password = body.password;
        } catch (error) {
            return Observable.create((observer) => {
                observer.error({
                    message: "Invalid JSON in request body",
                    statusCode: 400
                });
            });
        }
        if(this.actioncd=='getsecurityobject')
        {
            console.log("i am here", this.actioncd)
            return this.securityBusinessService.checkUserInfo(this.username, this.password);
        }
        else 
        {
            // Return an Observable with error for unsupported actions
            return Observable.create((observer) => {
                observer.error({
                    message: "Unsupported action code: " + this.actioncd,
                    statusCode: 400
                });
            });
        }

    }

}
