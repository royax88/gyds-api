import { Observable } from 'rxjs/Observable';
import {DynamoDBDataService} from '../data-service/security-data-service';
import {noSqlParams} from './nosqlparams';

export class SecurityBusinessService {

    private dynamoDBDataService = new DynamoDBDataService();
    private noSqlParams = new noSqlParams();

    constructor() {

    }

    public checkUserInfo(username, password) : Observable<any> {

        let queryParams = this.noSqlParams.checkUserLogin(username, password);
        return Observable.create((observer) => {

            this.dynamoDBDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    if(data.Count == 0)
                    {
                        let msg = {
                            message: "NotFound"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    else {
                        if(data.Items[0].status == "inactive")
                        {
                            let msg = {
                                message: "inactive"
                            }
                            observer.next(msg);
                            observer.complete();
                        }
                        else {

                            let lmsRoleParams = this.noSqlParams.getLMSrole(username);
                            this.dynamoDBDataService.executequeryDataService(lmsRoleParams).subscribe(
                                (lmsroledata) => {
                                    let info = 
                                    {
                                        id: 1,
                                        fullName: data.Items[0].firstNm + " " + data.Items[0].lastNm,
                                        systemRole: data.Items[0].systemRole,
                                        module: data.Items[0].module,
                                        lmsRole: lmsroledata.Items[0].lmsrole,
                                        apikey: process.env["apikey"],
                                        message: "validuser"
                                    }
                                    observer.next(info);
                                    observer.complete();
                                } 
                            )

                        }
                        
                    }
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

}