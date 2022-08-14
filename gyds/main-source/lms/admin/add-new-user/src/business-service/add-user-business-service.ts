import { Observable } from 'rxjs/Observable';
import {AddUserDataService} from '../data-service/add-user-data-service';
import {AddUserNoSQLParams} from './nosqlparams';

export class AddUserBusinessService {

    private addUserDataService = new AddUserDataService();
    private addUserNoSQLParams = new AddUserNoSQLParams();

    constructor() {

    }

    public checkUserInfo() : Observable<any> {
       
        let queryParams = this.addUserNoSQLParams.getALlUser();
        return Observable.create((observer) => {

            this.addUserDataService.executescanDS(queryParams).subscribe(
                (data) => {
                    let objData = []
                    for(let item in data.Items)
                    {
                        let newItem = {
                            fullName: data.Items[item].firstNm.toUpperCase() + " " + data.Items[item].lastNm.toUpperCase(),
                            role: data.Items[item].systemRole,
                            username: data.Items[item].username,
                            currentPlan: 'LMS',
                            status: data.Items[item].status
                        }
                        
                        objData.push(newItem)
                    }
                    observer.next(objData)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getUsersByModule(moduleNm: any) : Observable<any> {
       
        let queryParams = this.addUserNoSQLParams.getALlUserByModule(moduleNm);
        return Observable.create((observer) => {

            this.addUserDataService.executescanDS(queryParams).subscribe(
                (data) => {
                    let objData = []
                    for(let item in data.Items)
                    {
                        let newItem = {
                            fullName: data.Items[item].firstNm.toUpperCase() + " " + data.Items[item].lastNm.toUpperCase(),
                            username: data.Items[item].username
                        }
                        
                        objData.push(newItem)
                    }
                    observer.next(objData)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public insertIntoUser(obj: any) : Observable<any> {
        let queryParams = this.addUserNoSQLParams.checkExistingUsername(obj.data.username);
        
        return Observable.create((observer) => {

            this.addUserDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    if(data.Count > 0)
                    {
                        let msg = {
                            message: "ExistingUser"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    else 
                    {
                        let insertParams = this.addUserNoSQLParams.insertIntoUserTable(obj);
                        this.addUserDataService.InsertData(insertParams).subscribe(
                            (data) => {

                                let msg = {
                                    message: "NewUser"
                                }
                                observer.next(msg);
                                observer.complete();
 
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
                      
                    }
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public checkUsername(username: any) : Observable<any> {
       
        let queryParams = this.addUserNoSQLParams.checkExistingUsername(username);
        
        return Observable.create((observer) => {

            this.addUserDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    if(data.Count > 0)
                    {
                        let msg = {
                            message: "ExistingUser"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    else 
                    {
                        let msg = {
                            message: "NewUser"
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

    public getUserRole(username: any) : Observable<any> {
       
        let queryParams = this.addUserNoSQLParams.getUserRole(username);
        
        return Observable.create((observer) => {

            this.addUserDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                        observer.next(data);
                        observer.complete();
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public updateLMSRole(obj: any) : Observable<any> {

        let checkExistingRole = this.addUserNoSQLParams.getUserRole(obj.data.username);
        let queryParams = this.addUserNoSQLParams.updateLMSRole(obj);
        let insertParams = this.addUserNoSQLParams.insertIntoUserRoleTbl(obj);
        return Observable.create((observer) => {

            this.addUserDataService.executequeryDataService(checkExistingRole).subscribe(
                (data) => {
                       if(data.Count > 0)
                       {
                            this.addUserDataService.executeupdate(queryParams).subscribe(
                                (data) => {
                                    
                                    let msg = {
                                        message: "updateLMSRole"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                    
                                },
                                (error) => {
                                    console.log("errr", error)
                                    observer.error(error);
                                });
                       }
                       else {
                        this.addUserDataService.InsertData(insertParams).subscribe(
                            (data) => {
                                let msg = {
                                    message: "insertedLMSRole"
                                }
                                observer.next(msg);
                                observer.complete();
                                
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
                       }
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });

          
        })

    }

}