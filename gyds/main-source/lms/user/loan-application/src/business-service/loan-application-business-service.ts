import { Observable } from 'rxjs/Observable';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanApplicationNoSQLParams} from './nosqlparams';
import {AuditBusinessService} from '../../../../../../common/audit/audit.business.service'
import {MatrixNoSQLParams} from '../../../../config/manage-configuration/src/business-service/matrixNosqlparams';
import {APICheckerBusinessService} from '../../../../../../common/api-check/api-checker.business.service';
export class LoanApplicationBusinessService {

    private loanApplicationDataService = new LoanApplicationDataService();
    private loanApplicationNoSQLParams = new LoanApplicationNoSQLParams();
    private matrixParams = new MatrixNoSQLParams();
    private auditSvc = new AuditBusinessService();
    private apiChecker = new APICheckerBusinessService();
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

    public getLoanByMatrix(username: any) : Observable<any> {

       
        let matrixParams = this.matrixParams.getMatrixByProcessor(username);
        return Observable.create((observer) => {

            this.apiChecker.isValidUserPerModule(username, "processor").subscribe(
                (data) => {
                    
                    if(data.message == "authorized")
                    {
                        this.loanApplicationDataService.executequeryDataService(matrixParams).subscribe(
                            (matrixData) => {
                                let count = 0; 
                                let objData = []
                                if(matrixData.Count == 0)
                                {
                                    observer.next(data);
                                    observer.complete();
                                }
                                for(let matrixItem in matrixData.Items)
                                {
                                    let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(matrixData.Items[matrixItem].bpcode);
                                   
                                    this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
                                        (loanData) => {
                                            count = count + 1;
                                            for(let item in loanData.Items)
                                            {
                                                let loanRequests = {
                                                    id: loanData.Items[item].loankey,
                                                    applicantName: loanData.Items[item].applicantLastNm,
                                                    status: loanData.Items[item].status,
                                                    applicationDate: loanData.Items[item].applicationDate
                                                }  
                                                objData.push(loanRequests)
                                            }   
            
                                            if(count == matrixData.Count)
                                            {
                                                observer.next(objData)
                                                observer.complete();
                                            }
                
                                        },
                                        (error) => {
                                            console.log("errr", error)
                                            observer.error(error);
                                        }
                                    ) 
                                }
                                
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
                    }
                    else {
                        observer.next(data)
                        observer.complete();
                    }
                },
                (error) => {
    
                }
            )

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
        let matrixParms = this.matrixParams.insertMatrixTbl(queryParams.Item.loankey, obj.data.createdBy, obj.data.username);

        return Observable.create((observer) => {
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

                                this.loanApplicationDataService.InsertData(matrixParms).subscribe(
                                    (data) => {
                                        let msg = {
                                            message: "CreatedNewLoan"
                                        }
                                        observer.next(msg);
                                        observer.complete();
                                    },
                                    (error) => {
                                        observer.error(error);
                                    }
                                )                 
                            
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