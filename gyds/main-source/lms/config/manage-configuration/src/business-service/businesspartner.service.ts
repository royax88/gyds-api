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
        return Observable.create((observer) => {
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

}