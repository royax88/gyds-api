import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {BusinessPartnerNoSQLParams} from './businesspartnerNosqlparams';
export class BusinssPartnerBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private noparams = new BusinessPartnerNoSQLParams();
    constructor() {

    }

    public insertBusinessPartner(obj: any) : Observable<any> {
        
        let queryParams = this.noparams.insertIntoBusinessPartnerTbl(obj);
        let existingCodeParams = this.noparams.checkExistingCode(obj.data.bpCode.toLowerCase());
        return Observable.create((observer) => {


            this.manageConfigDataService.executequeryDataService(existingCodeParams).subscribe(
                (existingBpCode) => {
                    if(existingBpCode.Count > 0)
                    {
                        let msg = {
                            message: "existingCode"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    else {
                        this.manageConfigDataService.InsertData(queryParams).subscribe(
                            (data) => {
                                
                                let msg = {
                                    message: "createdBusinessPartner"
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
                    observer.error(error);
                }
                )
            
        })

    }

    public updateBusinessPartner(obj: any) : Observable<any> {

        let queryParams = this.noparams.updateIntoBusinessPartnerTbl(obj);
        console.log("")
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updateBusinessPartner"
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


    public getAllBusinessPartner() : Observable<any> {

       
        let queryParams = this.noparams.getAllBusinessPartner();
       
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

    public getBPCodes() : Observable<any> {

       
        let queryParams = this.noparams.getAllBusinessPartner();
       
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {    
                    let newObj = [];    
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let codes = {
                                name: data.Items[item].bpName,
                                value: data.Items[item].bpCode
                            }
                            newObj.push(codes);
                        }
                        observer.next(newObj)
                        observer.complete();
                    }     

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