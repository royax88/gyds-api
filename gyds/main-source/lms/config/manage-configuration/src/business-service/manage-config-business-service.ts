import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {ManageConfigNoSQLParams} from './nosqlparams';
import {ProvinceNoSQLParams} from './provinceNosqlparams';
import {CurrencyNoSQLParams} from './currencyNosqlparams';
import {CompanyNoSQLParams} from './companyNosqlparams';
export class ManageConfigBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private manageConfigNoSQLParams = new ManageConfigNoSQLParams();
    private provinceNoSQLParams = new ProvinceNoSQLParams();
    private currencyNoSQLPrams = new CurrencyNoSQLParams();
    private companyParams = new CompanyNoSQLParams();
    constructor() {

    }

    public getConfigValules(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfig(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {
                    let objData = []
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let newVal = {
                                code: data.Items[item].code,
                                value: data.Items[item].valueVal,
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

    public getAllData(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfig(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
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
                            if(data.Items[item].statusVal=="active")
                            {
                                let newVal = {
                                    code: data.Items[item].codeVal,
                                    value: data.Items[item].valueVal,
                                    description: data.Items[item].description,
                                    detail1: data.Items[item].detail1
                                }
                                objData.push(newVal);
                            }
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
                        message: "createdConfig"
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
                        message: "updatedConfig"
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

        else if(name == "province")
        {
            queryParams = this.provinceNoSQLParams.insertCountryTbl(obj);
        }

        else if(name == "provinceUpdate")
        {
            queryParams = this.provinceNoSQLParams.updateProvinceTbl(obj);
        }

        else if(name == "currency")
        {
            queryParams = this.currencyNoSQLPrams.insertCurrencyTbl(obj);
        }

        else if(name == "currencyUpdate")
        {
            queryParams = this.currencyNoSQLPrams.updateCurrencyTbl(obj);
        }

        else if(name == "company")
        {
            queryParams = this.companyParams.insertCompanyTbl(obj);
        }

        else if(name == "companyUpdate")
        {
            queryParams = this.companyParams.updateCompanyTbl(obj);
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