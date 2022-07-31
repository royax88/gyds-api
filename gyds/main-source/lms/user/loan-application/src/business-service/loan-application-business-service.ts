import { Observable } from 'rxjs/Observable';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanApplicationNoSQLParams} from './nosqlparams';
import {AuditBusinessService} from '../../../../../../common/audit/audit.business.service'

export class LoanApplicationBusinessService {

    private loanApplicationDataService = new LoanApplicationDataService();
    private loanApplicationNoSQLParams = new LoanApplicationNoSQLParams();
    private auditSvc = new AuditBusinessService();

    constructor() {

    }

    // public getConfigValules(name: any) : Observable<any> {
       
    //     let queryParams = this.manageConfigNoSQLParams.getConfig(name);
    //     return Observable.create((observer) => {

    //         this.manageConfigDataService.executescanDS(queryParams).subscribe(
    //             (data) => {
    //                 let objData = []
    //                 console.log("data", data)
    //                 if(data.Count > 0)
    //                 {
    //                     for(let item in data.Items)
    //                     {
    //                         let newVal = {
    //                             code: data.Items[item].code,
    //                             value: data.Items[item].value,
    //                         }
    //                         objData.push(newVal);
    //                     }
    //                 }
                   
    //                 observer.next(objData)
    //                 observer.complete();
                    
    //             },
    //             (error) => {
    //                 console.log("errr", error)
    //                 observer.error(error);
    //             });
    //     })

    // }


    public insertIntoLoanTable(obj: any) : Observable<any> {

        let queryParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj);
        
        return Observable.create((observer) => {
            console.log("queryParams", queryParams.Item.loankey)
            this.loanApplicationDataService.InsertData(queryParams).subscribe(
                (data) => {
                    
                    //insert into audit table
                    this.auditSvc.insertIntoAuditTbl(
                        queryParams.Item.loankey, 
                        queryParams.Item.status,
                        "Create New Loan Application",
                        queryParams.Item.createdBy,
                        queryParams.Item.createdDate
                        ).subscribe(
                            (data) => {
                                let msg = {
                                    message: "CreatedNewLoan"
                            }
                            observer.next(msg);
                            observer.complete();
                            }   
                        )
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


}