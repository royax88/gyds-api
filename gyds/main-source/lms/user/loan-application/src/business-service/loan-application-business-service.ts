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

    public getLoanRequest(username: any) : Observable<any> {
       
        let queryParams = this.loanApplicationNoSQLParams.viewLoanRequest(username);
        return Observable.create((observer) => {

            this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    let objData = []
                    for(let item in data.Items)
                    {
                        let loanRequests = {
                            id: data.Items[item].loankey,
                            applicantName: data.Items[item].applicantFirstNm.toUpperCase() + " " + data.Items[item].applicantLastNm.toUpperCase(),
                            status: data.Items[item].status,
                            applicationDate: data.Items[item].applicationDate
                        }
                        
                        objData.push(loanRequests)
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

    public getLoanRequestById(loankey: any) : Observable<any> {
       
        let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(loankey);
        return Observable.create((observer) => {

            this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    let objData = []
                    // for(let item in data.Items)
                    // {
                    //     let loanRequests = {
                    //         id: data.Items[item].loankey,
                    //         applicantName: data.Items[item].applicantFirstNm.toUpperCase() + " " + data.Items[item].applicantLastNm.toUpperCase(),
                    //         status: data.Items[item].status,
                    //         applicationDate: data.Items[item].applicationDate
                    //     }
                        
                    //     objData.push(loanRequests)
                    // }
                    observer.next(data.Items)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


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