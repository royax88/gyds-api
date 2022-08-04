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
                                code: data.Items[item].codeVal,
                                value: data.Items[item].valueVal,
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

    public insertConfig(obj: any,name: any) : Observable<any> {

        let queryParams = this.getParams(obj, name);
        console.log("")
        return Observable.create((observer) => {
            this.manageConfigDataService.InsertData(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "createdCountry"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public updateConfig(obj: any,name: any) : Observable<any> {

        let queryParams = this.getParams(obj, name);
        console.log("")
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updatedCountry"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getParams( obj: any, name: any)
    {
        let queryParams : any;
        if(name == "country")
        {
            queryParams = this.manageConfigNoSQLParams.insertCountryTbl(obj);
        }
        else if(name == "countryUpdate")
        {
            queryParams = this.manageConfigNoSQLParams.updateCountryTbl(obj);
        }
       
        return queryParams
    }

    public getAllConfigurationByName(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfigByName(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    observer.next(data)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

}