import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {ManageConfigNoSQLParams} from './nosqlparams';

export class ManageConfigBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private manageConfigNoSQLParams = new ManageConfigNoSQLParams();

    constructor() {

    }

    public getConfigValules(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfig(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {
                    let objData = []
                    console.log("data", data)
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let newVal = {
                                code: data.Items[item].code,
                                value: data.Items[item].value,
                            }
                            objData.push(newVal);
                        }
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

    public getConfigByName(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfigByName(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    let objData = []
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let newVal = {
                                code: data.Items[item].code,
                                value: data.Items[item].value,
                                description: data.Items[item].description
                            }
                            objData.push(newVal);
                        }
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

    // public insertIntoUser(obj: any) : Observable<any> {
    //     let queryParams = this.addUserNoSQLParams.checkExistingUsername(obj.data.username);
        
    //     return Observable.create((observer) => {

    //         this.addUserDataService.executequeryDataService(queryParams).subscribe(
    //             (data) => {
    //                 if(data.Count > 0)
    //                 {
    //                     let msg = {
    //                         message: "ExistingUser"
    //                     }
    //                     observer.next(msg);
    //                     observer.complete();
    //                 }
    //                 else 
    //                 {
    //                     let insertParams = this.addUserNoSQLParams.insertIntoUserTable(obj);
    //                     this.addUserDataService.InsertData(insertParams).subscribe(
    //                         (data) => {

    //                             let msg = {
    //                                 message: "NewUser"
    //                             }
    //                             observer.next(msg);
    //                             observer.complete();
 
    //                         },
    //                         (error) => {
    //                             console.log("errr", error)
    //                             observer.error(error);
    //                         });
                      
    //                 }
                    
    //             },
    //             (error) => {
    //                 console.log("errr", error)
    //                 observer.error(error);
    //             });
    //     })

    // }

    // public checkUsername(username: any) : Observable<any> {
       
    //     let queryParams = this.addUserNoSQLParams.checkExistingUsername(username);
        
    //     return Observable.create((observer) => {

    //         this.addUserDataService.executequeryDataService(queryParams).subscribe(
    //             (data) => {
    //                 if(data.Count > 0)
    //                 {
    //                     let msg = {
    //                         message: "ExistingUser"
    //                     }
    //                     observer.next(msg);
    //                     observer.complete();
    //                 }
    //                 else 
    //                 {
    //                     let msg = {
    //                         message: "NewUser"
    //                     }
    //                     observer.next(msg);
    //                     observer.complete();
    //                 }
                    
    //             },
    //             (error) => {
    //                 console.log("errr", error)
    //                 observer.error(error);
    //             });
    //     })

    // }

}