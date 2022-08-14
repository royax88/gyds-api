import { Observable } from 'rxjs/Observable';
import {APICheckNoSqlParams} from './api-checker.nosqlparams';
import {AddUserNoSQLParams} from '../../main-source/lms/admin/add-new-user/src/business-service/nosqlparams';
import {AddUserDataService} from '../../main-source/lms/admin/add-new-user/src/data-service/add-user-data-service';
import {MatrixNoSQLParams} from '../../main-source/lms/config/manage-configuration/src/business-service/matrixNosqlparams';
var dateFormat = require('dateformat');

export class APICheckerBusinessService {
    private apicheckerparams = new APICheckNoSqlParams();
    private addUserNoSQLParams = new AddUserNoSQLParams();
    private addUserDataService = new AddUserDataService();
    private matrixNoSQLParams = new MatrixNoSQLParams();
    constructor() {

    }

    //pass the function name, username

    public isValidUserPerModule(username, moduleNm) : Observable<any> {
       
        let queryParams = this.addUserNoSQLParams.checkExistingUsername(username);
        return Observable.create((observer) => {

            this.addUserDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    
                    let dateToday=dateFormat(new Date(), "yyyy-mm-dd");
                    let convertDateToday = new Date(dateToday)
                    let convertFrom = new Date(data.Items[0].validFrom)
                    let convertTo = new Date(data.Items[0].validTo)

                    if(convertDateToday >= convertFrom && convertDateToday <= convertTo)
                    {
                        let roleParams = this.addUserNoSQLParams.getUserRole(username);

                        this.addUserDataService.executequeryDataService(roleParams).subscribe(
                            (data) => {
                                let validAccess : any = false;
                                if(data.Count > 0)
                                {
                                    for(let item in data.Items)
                                    {
                                        for(let val in data.Items[item].lmsrole)
                                        {
                                            if(data.Items[item].lmsrole[val]== moduleNm)
                                            {
                                                validAccess = true;
                                            }
                                        }
                                    }

                                    if(validAccess == true)
                                    {
                                        let msg = {
                                            message: "authorized"
                                        }
                                        observer.next(msg);
                                        observer.complete();
                                    }
                                    else {
                                        let msg = {
                                            message: "unauthorized"
                                        }
                                        observer.next(msg);
                                        observer.complete();
                                    }
                                }
                                else {
                                    let msg = {
                                        message: "unauthorized"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                }
                                
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            }
                        )
                    }
                    else {
                        let msg = {
                            message: "unauthorized"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


}