import { Observable } from 'rxjs/Observable';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanApplicationNoSQLParams} from './nosqlparams';
import {AuditBusinessService} from '../../../../../../common/audit/audit.business.service'
import {MatrixNoSQLParams} from '../../../../config/manage-configuration/src/business-service/matrixNosqlparams';
import {APICheckerBusinessService} from '../../../../../../common/api-check/api-checker.business.service';
import {AddUserNoSQLParams} from '../../../../../lms/admin/add-new-user/src/business-service/nosqlparams';
import {RoleNoSQLParams} from '../../../../../lms/config/manage-configuration/src/business-service/roleNosqlparams';
export class LoanApplicationBusinessService {

    private loanApplicationDataService = new LoanApplicationDataService();
    private loanApplicationNoSQLParams = new LoanApplicationNoSQLParams();
    private matrixParams = new MatrixNoSQLParams();
    private auditSvc = new AuditBusinessService();
    private apiChecker = new APICheckerBusinessService();
    private lmsRole = new AddUserNoSQLParams();
    private roleMatrix = new RoleNoSQLParams();
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

    public getLoanByMatrixByProcessorV2(username: any) : Observable<any> {

       
        
        let roleParams = this.lmsRole.getUserRole(username);
        return Observable.create((observer) => {

            this.apiChecker.isValidUserPerModule(username, "processor").subscribe(
                (data) => {
                    
                    if(data.message == "authorized")
                    {
                        this.loanApplicationDataService.executequeryDataService(roleParams).subscribe(
                            (roleParamsResults) => {
                                let count = 0; 
                                if(roleParamsResults.Items[0].lmsroleNm.length > 0)
                                {
                                    let holderObj = [];
                                    for(let item in roleParamsResults.Items[0].lmsroleNm)
                                    {
                                        
                                        let checkVal = this.roleMatrix.getRoleMatrix("processor", roleParamsResults.Items[0].lmsroleNm[item])

                                        this.loanApplicationDataService.executequeryDataService(checkVal).subscribe(
                                            (checkValResults)=> {
                                                if(checkValResults.Count > 0)
                                                { 
                                                   let matrixParams = this.matrixParams.getMatrixByProcessor(roleParamsResults.Items[0].lmsroleNm[item]);
                                                   this.loanApplicationDataService.executequeryDataService(matrixParams).subscribe(
                                                    (matrixParamsResults) => {
                                                        if(matrixParamsResults.Count > 0)
                                                        {
                                                            for(let res in matrixParamsResults.Items)
                                                            {
                                                                
                                                                let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(matrixParamsResults.Items[res].bpcode);
                                                                
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
                                                                                holderObj.push(loanRequests)
                                                                            }   

                                                                            if(count == matrixParamsResults.Count)
                                                                            {
                                                                                observer.next(holderObj);
                                                                                observer.complete();
                                                                            }
                                                                    }
                                                                )
                                                             
                                                            }
                                                        } 
                                                        else {
                                                            let msg = {
                                                                message: "NoRecords"
                                                            }
                                                            observer.next(msg);
                                                            observer.complete();
                                                        }
                                                    }
                                                   )
                                                }
                                                 
                                            }
                                        )
                                    } 

                                }
                                else {
                                    let msg = {
                                        message: "NoRecords"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                }
                            }
                        )

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

    // public getLoanByMatrix(username: any) : Observable<any> {

       
    //     let matrixParams = this.matrixParams.getMatrixByProcessor(username);
    //     return Observable.create((observer) => {

    //         this.apiChecker.isValidUserPerModule(username, "processor").subscribe(
    //             (data) => {
                    
    //                 if(data.message == "authorized")
    //                 {
    //                     this.loanApplicationDataService.executequeryDataService(matrixParams).subscribe(
    //                         (matrixData) => {
    //                             let count = 0; 
    //                             let objData = []
    //                             if(matrixData.Count == 0)
    //                             {
    //                                 observer.next(data);
    //                                 observer.complete();
    //                             }
    //                             for(let matrixItem in matrixData.Items)
    //                             {
    //                                 let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(matrixData.Items[matrixItem].bpcode);
                                   
    //                                 this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
    //                                     (loanData) => {
    //                                         count = count + 1;
    //                                         for(let item in loanData.Items)
    //                                         {
    //                                             let loanRequests = {
    //                                                 id: loanData.Items[item].loankey,
    //                                                 applicantName: loanData.Items[item].applicantLastNm,
    //                                                 status: loanData.Items[item].status,
    //                                                 applicationDate: loanData.Items[item].applicationDate
    //                                             }  
    //                                             objData.push(loanRequests)
    //                                         }   
            
    //                                         if(count == matrixData.Count)
    //                                         {
    //                                             observer.next(objData)
    //                                             observer.complete();
    //                                         }
                
    //                                     },
    //                                     (error) => {
    //                                         console.log("errr", error)
    //                                         observer.error(error);
    //                                     }
    //                                 ) 
    //                             }
                                
    //                         },
    //                         (error) => {
    //                             console.log("errr", error)
    //                             observer.error(error);
    //                         });
    //                 }
    //                 else {
    //                     observer.next(data)
    //                     observer.complete();
    //                 }
    //             },
    //             (error) => {
    
    //             }
    //         )

    //     })

    // }

    public getLoanRequestById(loankey: any, username: any) : Observable<any> {
       
        let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(loankey);
        return Observable.create((observer) => {

            this.apiChecker.validatePerLoanKey(username,"processor",loankey).subscribe(
                (data) => {
                    if(data.message == "authorized")
                    {
                        this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
                            (data) => {
                                let objData = []
                                observer.next(data.Items)
                                observer.complete();
                                
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
                    }
                    else {
                        observer.next(data);
                        observer.complete();
                    }
                }
            )
          
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

    public getAllForms() : Observable<any> {

       
        let queryParams = this.loanApplicationNoSQLParams.getLoanTransactionByStatus();
       
        return Observable.create((observer) => {

            this.loanApplicationDataService.executescanDS(queryParams).subscribe(
                (data) => {            
                    let obj =[];
                    for(let item in data.Items)
                    {
                        let newVal = {
                            id: data.Items[item].loankey,
                            name: data.Items[item].loankey
                        }
                        obj.push(newVal)
                    } 
                    observer.next(obj)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


}