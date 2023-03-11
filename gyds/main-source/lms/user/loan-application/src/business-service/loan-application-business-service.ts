import { Observable } from 'rxjs/Observable';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanApplicationNoSQLParams} from './nosqlparams';
import {AuditBusinessService} from '../../../../../../common/audit/audit.business.service'
import {MatrixNoSQLParams} from '../../../../config/manage-configuration/src/business-service/matrixNosqlparams';
import {APICheckerBusinessService} from '../../../../../../common/api-check/api-checker.business.service';
import {AddUserNoSQLParams} from '../../../../../lms/admin/add-new-user/src/business-service/nosqlparams';
import {RoleNoSQLParams} from '../../../../../lms/config/manage-configuration/src/business-service/roleNosqlparams';
import {DocumentNoSQLParams} from '../../../../config/manage-configuration/src/business-service/documentNosqlparams';
import {FormNoSQLParams} from '../../../../config/manage-configuration/src/business-service/formNmNosqlparams';
import { max } from 'lodash';
import { ConsoleReporter } from 'jasmine';
var dateFormat = require('dateformat');

export class LoanApplicationBusinessService {

    private loanApplicationDataService = new LoanApplicationDataService();
    private loanApplicationNoSQLParams = new LoanApplicationNoSQLParams();
    private matrixParams = new MatrixNoSQLParams();
    private auditSvc = new AuditBusinessService();
    private apiChecker = new APICheckerBusinessService();
    private lmsRole = new AddUserNoSQLParams();
    private roleMatrix = new RoleNoSQLParams();
    private schemeCd = new DocumentNoSQLParams();
    private formParams = new FormNoSQLParams();
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
        console.log("getLoanByMatrixByProcessorV2")
        let roleParams = this.lmsRole.getUserRole(username);
        return Observable.create(async (observer) => {

            await this.apiChecker.isValidUserPerModule(username, "processor").subscribe(
                async (data) => {
                    
                    if(data.message == "authorized")
                    {
                        console.log("authorized processor")
                        await this.loanApplicationDataService.executequeryDataServicePromise(roleParams).then(
                           async (roleParamsResults) => {
                                let count = 0; 
                                console.log("length", roleParamsResults.Items[0].lmsroleNm.length)
                                if(roleParamsResults.Items[0].lmsroleNm.length > 0)
                                {
                                    
                                    let holderObj = [];
                                    let uniqueRole = roleParamsResults.Items[0].lmsroleNm.filter((item, i, ar) => ar.indexOf(item) === i)
                                    for(let item in uniqueRole)
                                    {
                                        
                                        let checkVal = this.roleMatrix.getRoleMatrix("processor", roleParamsResults.Items[0].lmsroleNm[item]);
                                        await this.loanApplicationDataService.executequeryDataServicePromise(checkVal).then(
                                            async (checkValResults)=> {
                                                
                                                if(checkValResults.Count > 0)
                                                { 
                                                   
                                                   let matrixParams = this.formParams.getFormProcessor(checkValResults.Items[0].roleNm);

                                                   await this.loanApplicationDataService.executequeryDataServicePromise(matrixParams).then(
                                                    async (matrixParamsResults) => {
                                                        console.log("matrixParamsResults", matrixParamsResults)
                                                        if(matrixParamsResults.Count > 0)
                                                        {
                                                            for(let res in matrixParamsResults.Items)
                                                            {
                                                                
                                                                let queryParams = this.loanApplicationNoSQLParams.getFormId(matrixParamsResults.Items[res].formid);
                                                                
                                                                await this.loanApplicationDataService.executequeryDataServicePromise(queryParams).then(
                                                                    (loanData) => {
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
                                                                    }
                                                                )
                                                             
                                                            }
                                                            
                                                        } 
                                                        // else {
                                                        //     let msg = {
                                                        //         message: "NoRecords"
                                                        //     }
                                                        //     observer.next(msg);
                                                        //     observer.complete();
                                                        // }
                                                    }
                                                   )
                                                }
                                                 
                                            }
                                        )
                                    } 
                                    observer.next(holderObj);
                                    observer.complete();
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



    public getLoanRequestById(loankey: any, username: any) : Observable<any> {
       
        let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(loankey);
        return Observable.create((observer) => {
            console.log("loankey", loankey)
            // this.apiChecker.validatePerLoanKey(username,"processor",loankey).subscribe(
            //     (data) => {
            //         console.log("data", data)
                    // if(data.message == "authorized")
                    // {
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
                    // }
                    // else {
                    //     observer.next(data);
                    //     observer.complete();
                    // }
                //}
        //     )
          
         })

    }

    public insertIntoLoanTable(obj: any) : Observable<any> {
        console.log("obj", obj)
        var currentDate=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let getSchemeParams = this.schemeCd.getSchemeByCode(obj.data.selectedRangeData.detail2);
        let getLoanParams = this.loanApplicationNoSQLParams.getFormId(obj.data.selectedRangeData.formid);
        //let queryParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj);
        // let matrixParms = this.matrixParams.insertMatrixTbl(queryParams.Item.loankey, obj.data.createdBy, obj.data.username);

        return Observable.create((observer) => {

            //include the formid, count in loan table
            //query scheme code - completed
            //query loan table for the last record - using created date and based on formid
            //generate the key
                   //if fy dependent is tick, check ang year
                   //if fy dependent is not tick, used all range
                   //check if na maxout na ang range

                   //if no existing record, use the min value 

            this.loanApplicationDataService.executequeryDataService(getSchemeParams).subscribe(
                (schemeObj) => {
                    this.loanApplicationDataService.executequeryDataService(getLoanParams).subscribe(
                        (loanData) => {
                            console.log("loandata", loanData)
                            if(loanData.Count > 0)
                            {
                                let isValidFY = this.isValidYearDependent(schemeObj, obj.data.selectedRangeData, obj.data.firstapplicationDate);

                                if(isValidFY == false)
                                {
                                    let msg = {
                                        message: "yearDependent"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                }
                                else {
                                    let maxVal = 0;
                                    for(let item in loanData.Items)
                                    {
                                        let tempVal = loanData.Items[item].incrementValue; //2
                                        
                                        if(tempVal > maxVal)
                                        {
                                            maxVal = loanData.Items[item].incrementValue;
                                        }

                                    }

                                    let newVal = Number(maxVal) + 1;
                                    if(newVal <= obj.data.selectedRangeData.detail4)
                                    {

                                        let loankey = this.generateKey(obj.data.selectedRangeData.formid,newVal, false);
                                        let insertParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj,loankey,obj.data.selectedRangeData.formid, newVal);
                                        this.loanApplicationDataService.InsertData(insertParams).subscribe(
                                            (data) => {
                                                //insert into audit table
                                                this.auditSvc.insertIntoAuditTbl(
                                                    loankey, 
                                                    "Processed",
                                                    "Create New Loan Application",
                                                    obj.data.createdBy,
                                                    currentDate
                                                    ).subscribe(
                                                        (data) => {            
                                                            let msg = {
                                                                message: "createdLoan"
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
                                    }
                                    else 
                                    {
                                        let msg = {
                                            message: "maximumCount"
                                        }
                                        observer.next(msg);
                                        observer.complete();
                                    }
                                    
                                }

                            }
                            else {
                                let isValidFY = this.isValidYearDependent(schemeObj, obj.data.selectedRangeData, obj.data.firstapplicationDate);

                                if(isValidFY == false)
                                {
                                    let msg = {
                                        message: "yearDependent"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                }
                                else {
                                    let loankey = this.generateKey(obj.data.selectedRangeData.formid,obj.data.selectedRangeData.detail3, true)
                                    let insertParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj,loankey,obj.data.selectedRangeData.formid, obj.data.selectedRangeData.detail3);
                                    
                                    this.loanApplicationDataService.InsertData(insertParams).subscribe(
                                                (data) => {
                                                    //insert into audit table
                                                    this.auditSvc.insertIntoAuditTbl(
                                                        loankey, 
                                                        "Processed",
                                                        "Create New Loan Application",
                                                        obj.data.createdBy,
                                                        currentDate
                                                        ).subscribe(
                                                            (data) => {            
                                                                let msg = {
                                                                    message: "createdLoan"
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
                                }
                               
                                
                                
                                
                            }
                            
                        },
                        (error) => {
                            console.log("errr", error)
                            observer.error(error);
                    });
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
            });
        
        })

    }

    private generateKey(formid: any, increment: any, isNew: any)
    {
            return formid + "-" + increment;
    }

    private isValidYearDependent(schemeObj: any, selected: any, applicationDt: any)
    {
        let appDate = applicationDt.year + "-" + applicationDt.month + "-" + applicationDt.day
        let day= new Date(appDate);

        if(schemeObj.Items[0].detail1 == false)
        {
            let convertedSelectedDate = new Date(selected.detail1).getUTCFullYear();
            let currentYear = day.getUTCFullYear();

            if(convertedSelectedDate != currentYear)
            {
                return false;
            }  
            else {
                return true;
            }

        }
        else {
            return true;
        }
    }

    // public insertIntoLoanTable(obj: any) : Observable<any> {
    //     console.log("obj", obj)
    //     let queryParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj);
    //     // let matrixParms = this.matrixParams.insertMatrixTbl(queryParams.Item.loankey, obj.data.createdBy, obj.data.username);

    //     return Observable.create((observer) => {

    //         let msg = {}
    //         observer.next(msg);
    //         observer.complete();

    //         //include the formid, count in loan table
    //         //query scheme code
    //         //query loan table for the last record - using created date and based on formid
    //         //generate the key
    //                //if fy dependent is tick, check ang year
    //                //if fy dependent is not tick, used all range
    //                //check if na maxout na ang range

    //                //if no existing record, use the min value 

    //         this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
    //             (data) => {
    //                 let objData = []
    //                 observer.next(data.Items)
    //                 observer.complete();
                    
    //             },
    //             (error) => {
    //                 console.log("errr", error)
    //                 observer.error(error);
    //         });
            
    //         // this.loanApplicationDataService.InsertData(queryParams).subscribe(
    //         //     (data) => {
                    
    //         //         //insert into audit table
    //         //         this.auditSvc.insertIntoAuditTbl(
    //         //             queryParams.Item.loankey, 
    //         //             queryParams.Item.status,
    //         //             "Create New Loan Application",
    //         //             queryParams.Item.createdBy,
    //         //             queryParams.Item.createdDate
    //         //             ).subscribe(
    //         //                 (data) => {            
                            
    //         //                 }   
    //         //             )
                    
    //         //     },
    //         //     (error) => {
    //         //         console.log("errr", error)
    //         //         observer.error(error);
    //         //     });
    //     })

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