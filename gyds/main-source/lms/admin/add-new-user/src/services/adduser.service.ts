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
            this.objData = body;
        } catch (error) {
            return Observable.create((observer) => {
                observer.error({
                    message: "Invalid JSON in request body",
                    statusCode: 400
                });
            });
        }

        if(this.actioncd=='searchUser')
        {
            console.log("user")
            return this.addUserBusinessService.checkUserInfo();
        }
        else if(this.actioncd=='insertNewUser')
        {
            return this.addUserBusinessService.insertIntoUser(this.objData);
        }

        else if(this.actioncd=='getAllUserByModule')
        {
            if (!this.objData.moduleNm) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "moduleNm is required for getAllUserByModule action",
                        statusCode: 400
                    });
                });
            }
            return this.addUserBusinessService.getUsersByModule(this.objData.moduleNm);
        }
        else if(this.actioncd=="getUserRoleByUsername")
        {
            if (!this.objData.username) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "username is required for getUserRoleByUsername action",
                        statusCode: 400
                    });
                });
            }
            return this.addUserBusinessService.getUserRole(this.objData.username);
        }
        else if(this.actioncd=="updateLMSRole")
        {
            return this.addUserBusinessService.updateLMSRole(this.objData);
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
