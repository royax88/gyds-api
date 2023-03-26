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
                            status: data.Items[item].statusVal,
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

    public searchDocNumber(event: any) : Observable<any> {
       console.log("event", event)
        // let queryParams = this.loanApplicationNoSQLParams.getLoanTranByDocNumber(event);
        let queryParams = this.loanApplicationNoSQLParams.getLoanTransactionByStatus();
        return Observable.create( async (observer) => {
            await this.loanApplicationDataService.executescanDS(queryParams).subscribe(
                (data) => {            
                    let obj =[];
                    let max = 0;
                    for(let item in data.Items)
                    {
                        if (data.Items[item].docNumber.indexOf(event) > -1 || data.Items[item].docNumber === event) {
                            max = max + 1;
                            let newVal = {
                                docNumber: data.Items[item].docNumber,
                                formidval: data.Items[item].loankey
                            }
                            obj.push(newVal)
                            if(max == 3) break;
                          }
                       
                    } 
                    observer.next(obj)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
            // this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
            //     (data) => {
            //         let objData = []
            //         let max = 0;
            //         for(let item in data.Items)
            //         {
            //             max = max + 1;
            //             let loanRequests = {
            //                 docNumber: data.Items[item].docNumber
            //             }
                        
            //             objData.push(loanRequests)
            //             if(max == 3) break;
            //         }
            //         observer.next(objData)
            //         observer.complete();
                    
            //     },
            //     (error) => {
            //         console.log("errr", error)
            //         observer.error(error);
            //     });
        })

    }

    public getLoanByMatrixByProcessorV2(username: any, ojbData: any) : Observable<any> {
        console.log("getLoanByMatrixByProcessorV2")
        let roleParams = this.lmsRole.getUserRole(username);
        return Observable.create(async (observer) => {

            await this.apiChecker.isValidUserPerModule(username, ojbData.userRole).subscribe(
                async (data) => {
                    
                    if(data.message == "authorized")
                    {
                        console.log("authorized")
                        await this.loanApplicationDataService.executequeryDataServicePromise(roleParams).then(
                           async (roleParamsResults) => {
                                let count = 0; 
                                
                                if(roleParamsResults.Items[0].lmsroleNm.length > 0)
                                {
                                    
                                    let holderObj = [];
                                    let uniqueRole = roleParamsResults.Items[0].lmsroleNm.filter((item, i, ar) => ar.indexOf(item) === i)
                                        
                                        let checkVal = this.roleMatrix.getRoleMatrix(ojbData.userRole, "");
                                        await this.loanApplicationDataService.executequeryDataServicePromise(checkVal).then(
                                            async (checkValResults)=> {
                                                
                                                if(checkValResults.Count > 0)
                                                { 
                                                   let filterRole = [];
                                                   for (let item in uniqueRole)
                                                   {
                                                        for(let valR in checkValResults.Items)
                                                        {
                                                    
                                                            if(uniqueRole[item]==checkValResults.Items[valR].roleNm)
                                                            {
                                                                filterRole.push(uniqueRole[item])
                                                            }
                                                        }
                                                   }
                                                
                                                let filterRoleLength = filterRole.length;
                                                if(filterRoleLength == 0)
                                                {
                                                     let msg = {
                                                                message: "NoRecords"
                                                            }
                                                            observer.next(msg);
                                                            observer.complete();
                                                }
                                                else {
                                                        let docStatusParams : any;
                                                        docStatusParams = this.loanApplicationNoSQLParams.getAllActive()
                                                            
                                                            await this.loanApplicationDataService.executequeryDataServicePromise(docStatusParams).then(
                                                                async (loanData) => {
                                                                    let isLoan : any = false;
                                                        
                                                                        
                                                                        if(loanData.Count > 0)
                                                                        {
                                                                            
                                                                            for(let role in filterRole)
                                                                            {
                                                                                for (let loanval in loanData.Items)
                                                                                {
                                                                                    let matrixParams : any;
                                                                                    if(ojbData.userRole == "reviewer")
                                                                                    {
                                                                                        matrixParams  = this.formParams.getFormReviewer(loanData.Items[loanval].formid, filterRole[role]);
                                                                                    }
                                                                                    else if(ojbData.userRole == "approver")
                                                                                    {
                                                                                        matrixParams  = this.formParams.getFormApprover(loanData.Items[loanval].formid, filterRole[role]);
                                                                                    }
                                                                                    else {
                                                                                        matrixParams = this.formParams.getFormByDetail6(loanData.Items[loanval].formid,filterRole[role]);
                                                                                    }   
                                                                                    await this.loanApplicationDataService.executequeryDataServicePromise(matrixParams).then(
                                                                                        async (matrixParamsResults) => {
                                                                                                if(matrixParamsResults.Count > 0)
                                                                                                {
                                                                                                    
                                                                                                    for(let item in matrixParamsResults.Items)
                                                                                                    {
                                                                                                    
                                                                                                        if(this.CheckCOMaker(loanData,matrixParamsResults.Items, item, loanval))
                                                                                                        {
                                                                                                            let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                                                            holderObj.push(loanRequests)
                                                                                                        }
                                                                                                        else if(this.CheckPromissory(loanData,matrixParamsResults.Items, item, loanval))
                                                                                                        {
                                                                                                            let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                                                            holderObj.push(loanRequests)
                                                                                                        }
                                                                                                        else if(this.CheckAffidavitUndertaking(loanData,matrixParamsResults.Items, item, loanval))
                                                                                                        {
                                                                                                            let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                                                            holderObj.push(loanRequests)
                                                                                                        }
                                                                                                    }
                                                                                                    
                                                                                                }
                                                                                        }
                                                                                    )
                                                                                }
                                                                                
                                                                            }
                                                                        }
                                                                    // }
                                                                }
                                                        )
                                               
                                                }
                                                


                                                }
                                                 
                                            }
                                        )

                                        holderObj = holderObj.filter((value, index, self) =>
                                        index === self.findIndex((t) => (
                                          t.id === value.id
                                        ))
                                      )
                                    //filter based on id and status
                                    let retVal = this.filterReturn(holderObj, ojbData.statusVal, ojbData.docNumVal, ojbData.applicateDate, ojbData.applicateDateTo);
                                    observer.next(retVal);
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

    public getReleaseLoan(username: any, ojbData: any) : Observable<any> {
        console.log("getReleaseLoan")
        let roleParams = this.lmsRole.getUserRole(username);
        return Observable.create(async (observer) => {
            let holderObj = [];
            await this.apiChecker.isValidUserPerModule(username, ojbData.userRole).subscribe(
                async (data) => {
                    
                    if(data.message == "authorized")
                    {
                        console.log("authorized")
                                let count = 0; 
                                let checkVal = this.roleMatrix.getRoleMatrix(ojbData.userRole, "");
     
                                let docStatusParams : any;
                                docStatusParams = this.loanApplicationNoSQLParams.getAllApproved(ojbData.company);
                                                            
                                await this.loanApplicationDataService.executequeryDataServicePromise(docStatusParams).then(
                                     async (loanData) => {
                                         let isLoan : any = false;
                                            if(loanData.Count > 0)
                                                {
                                                    console.log("ojbData.collectionGroup", ojbData.collectionGroup)
                                                    console.log("ojbData.collectionAgent", ojbData.collectionAgent)
                                                    for (let loanval in loanData.Items)
                                                        {
                                                        if(ojbData.collectionGroup != "" && ojbData.collectionAgent != "" && ojbData.applicant != "")
                                                        {
                                                            if(ojbData.collectionGroup == loanData.Items[loanval].addtlCollectionGroup && ojbData.collectionAgent == loanData.Items[loanval].addtlCollectionAgent
                                                                && loanData.Items[loanval].applicantLastNm.toLowerCase().indexOf(ojbData.applicant.toLowerCase()) > -1)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup != "" && ojbData.collectionAgent != "" && ojbData.applicant == "")
                                                        {
                                                            if(ojbData.collectionGroup == loanData.Items[loanval].addtlCollectionGroup && ojbData.collectionAgent == loanData.Items[loanval].addtlCollectionAgent)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup != "" && ojbData.collectionAgent == "" && ojbData.applicant != "")
                                                        {
                                                            if(ojbData.collectionGroup == loanData.Items[loanval].addtlCollectionGroup && loanData.Items[loanval].applicantLastNm.toLowerCase().indexOf(ojbData.applicant.toLowerCase()) > -1)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup == "" && ojbData.collectionAgent != "" && ojbData.applicant != "")
                                                        {
                                                            if(ojbData.collectionAgent == loanData.Items[loanval].addtlCollectionAgent && loanData.Items[loanval].applicantLastNm.toLowerCase().indexOf(ojbData.applicant.toLowerCase()) > -1)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup != "" && ojbData.collectionAgent == "" && ojbData.applicant == "")
                                                        {
                                                            if(ojbData.collectionGroup == loanData.Items[loanval].addtlCollectionGroup)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup == "" && ojbData.collectionAgent != "" && ojbData.applicant == "")
                                                        {
                                                            if(ojbData.collectionAgent == loanData.Items[loanval].addtlCollectionAgent)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else if(ojbData.collectionGroup == "" && ojbData.collectionAgent == "" && ojbData.applicant != "")
                                                        {
                                                            if(loanData.Items[loanval].applicantLastNm.toLowerCase().indexOf(ojbData.applicant.toLowerCase()) > -1)
                                                            {
                                                                let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                                holderObj.push(loanRequests)
                                                            } 
                                                        }
                                                        else {
                                                            let loanRequests = this.transformResponse(loanData.Items,loanval)
                                                            holderObj.push(loanRequests)
                                                        }
                                                        
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
                                               
                            holderObj = holderObj.filter((value, index, self) =>
                            index === self.findIndex((t) => (
                            t.id === value.id
                            )))

                            let retVal = this.filterReturn(holderObj, ojbData.statusVal, ojbData.docNumVal, ojbData.applicateDate, ojbData.applicateDateTo, ojbData);
                            observer.next(retVal);
                            observer.complete();

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

    private filterReturn(responseObj: any, status: any, docNumber: any, appDate: any, appDateTo: any, objData? : any)
    {
        const appDateFrom = dateFormat(appDate, "yyyy-mm-dd");
        let convertDateFromUI = new Date(appDateFrom);
        let newObj = [];
        if(appDate != "" && status != "" && docNumber.length > 0)
        {
            for (let item in responseObj)
            {
                if(responseObj[item].status == status.value)
                {
                    for(let uiItem in docNumber)
                    {
                        if(docNumber[uiItem].docNumber == responseObj[item].docNumber)
                        {
                            let val = this.filterAppFromTo(responseObj[item], convertDateFromUI, appDateTo)
                            if (val != undefined) newObj.push(val)
                        }
                    }
                }
            }
            return newObj;
        }
        else if(appDate != "" && status != "" && docNumber.length == 0)
        {
            for (let item in responseObj)
            {
                if(responseObj[item].status == status.value)
                {
                    let val = this.filterAppFromTo(responseObj[item], convertDateFromUI, appDateTo)
                    if (val != undefined) newObj.push(val)
                }
            }
            return newObj;
        }
        else if(appDate != "" && status == "" && docNumber.length > 0)
        {
            for (let item in responseObj)
            {
                for(let uiItem in docNumber)
                    {
                        if(docNumber[uiItem].docNumber == responseObj[item].docNumber)
                        {
                            let val = this.filterAppFromTo(responseObj[item], convertDateFromUI, appDateTo)
                            if (val != undefined) newObj.push(val)
                        }
                    }
            }
            return newObj;
        }
        else if(appDate != "" && status == "" && docNumber.length == 0)
        {
            
            for (let item in responseObj)
            {
                let val = this.filterAppFromTo(responseObj[item], convertDateFromUI, appDateTo)
                if (val != undefined) newObj.push(val)
            }
            return newObj;
        }
        //Doc Number Object handling
        else if(appDate == "" && status == "" && docNumber.length > 0)
        {
            for (let item in responseObj)
            {
                for(let uiItem in docNumber)
                {
                    if(docNumber[uiItem].docNumber == responseObj[item].docNumber)
                    {
                        let loanRequests = {
                            id: responseObj[item].id,
                            applicantName: responseObj[item].applicantName,
                            status: responseObj[item].status,
                            applicationDate: responseObj[item].applicationDate,
                            docNumber: responseObj[item].docNumber
                        }  
                        newObj.push(loanRequests);
                    }
                }
            }
            return newObj;
        }
        else if(appDate == "" && status != "" && docNumber.length == 0)
        {
            for (let item in responseObj)
            {
                if(responseObj[item].status == status.value)
                {
                    let loanRequests = {
                        id: responseObj[item].id,
                        applicantName: responseObj[item].applicantName,
                        status: responseObj[item].status,
                        applicationDate: responseObj[item].applicationDate,
                        docNumber: responseObj[item].docNumber
                    }  
                    newObj.push(loanRequests);
                }
            }
            return newObj;
        }
        else if(appDate == "" && status != "" && docNumber.length > 0)
        {
            for (let item in responseObj)
            {
                if(responseObj[item].status == status.value)
                {
                    for(let uiItem in docNumber)
                    {
                        if(docNumber[uiItem].docNumber == responseObj[item].docNumber)
                        {
                            let loanRequests = {
                                id: responseObj[item].id,
                                applicantName: responseObj[item].applicantName,
                                status: responseObj[item].status,
                                applicationDate: responseObj[item].applicationDate,
                                docNumber: responseObj[item].docNumber
                            }  
                            newObj.push(loanRequests);
                        }
                    }
                }
            }
            return newObj;
        }
        else 
        {
            return responseObj;
        }
    }

    filterAppFromTo(responseObj, convertDateFromUI, appDateTo)
    {
                const responseAppdate = dateFormat(responseObj.applicationDate, "yyyy-mm-dd");
                let loanTransAppDate = new Date(responseAppdate)
                    if(loanTransAppDate >= convertDateFromUI)
                    {
                        
                        
                        if(appDateTo != "")
                        {
                            const appDateToVal = dateFormat(appDateTo, "yyyy-mm-dd");
                            let convertFromUITo = new Date(appDateToVal)
                            if(loanTransAppDate <= convertFromUITo)
                            {
                                let loanRequests = {
                                    id: responseObj.id,
                                    applicantName: responseObj.applicantName,
                                    status: responseObj.status,
                                    applicationDate: responseObj.applicationDate,
                                    docNumber: responseObj.docNumber
                                }  
                                return loanRequests
                            }
                            
                        }
                        else {
                            let loanRequests = {
                                id: responseObj.id,
                                applicantName: responseObj.applicantName,
                                status: responseObj.status,
                                applicationDate: responseObj.applicationDate,
                                docNumber: responseObj.docNumber
                            }  
                            return loanRequests
                        }
                        
                    }   
                    
    }


    private transformResponse(loanData: any, loanitem)
    {
        let loanRequests = {
            id: loanData[loanitem].loankey,
            applicantName: loanData[loanitem].applicantLastNm,
            status: loanData[loanitem].statusVal,
            applicationDate: loanData[loanitem].applicationDate,
            docNumber: loanData[loanitem].docNumber
        }  

        return loanRequests;
    }

    private CheckCOMaker(loanData, matrixParamsResults, item, loanitem)
    {
        if(loanData.Items[loanitem].formname = "Affidavit of Co-maker"
        && loanData.Items[loanitem].affivaditCMCurrency == matrixParamsResults[item].detail9
        && Number(loanData.Items[loanitem].affidavitCMAmount) <= Number(matrixParamsResults[item].detail5))
        {
            return true;
        }
        else {
            false;
        }
    }

    private CheckAffidavitUndertaking(loanData, matrixParamsResults, item, loanitem)
    {
        if(loanData.Items[loanitem].formname = "Affidavit of Undertaking"
        && loanData.Items[loanitem].affidavitUTCurrency == matrixParamsResults[item].detail9
        && Number(loanData.Items[loanitem].affidavitUTAmount) <= Number(matrixParamsResults[item].detail5))
        {
            return true;
        }
        else {
            false;
        }
    }

    private CheckPromissory(loanData, matrixParamsResults, item, loanitem)
    {
        if(loanData.Items[loanitem].formname = "Promissory Note"
        && loanData.Items[loanitem].promissoryCurrency == matrixParamsResults[item].detail9
        && Number(loanData.Items[loanitem].promissoryAmount) <= Number(matrixParamsResults[item].detail5))
        {
           
            return true;
        }
        else {
            false;
        }
    }

    public getLoanByMatrixByReviewer(username: any, identifier: any) : Observable<any> {
        console.log("getLoanByMatrixByReviewer")
        let roleParams = this.lmsRole.getUserRole(username);
        return Observable.create(async (observer) => {

            // await this.apiChecker.isValidUserPerModule(username, identifier).subscribe(
            //     async (data) => {
            //         console.log("data.message", data.message)
            //         if(data.message == "authorized")
            //         {
            //             await this.loanApplicationDataService.executequeryDataServicePromise(roleParams).then(
            //                async (roleParamsResults) => {
            //                     let count = 0; 
                               
            //                     if(roleParamsResults.Items[0].lmsroleNm.length > 0)
            //                     {
                                    
            //                         let holderObj = [];
            //                         let uniqueRole = roleParamsResults.Items[0].lmsroleNm.filter((item, i, ar) => ar.indexOf(item) === i)
            //                         // for(let item in uniqueRole)
            //                         // {
                                       
            //                             let checkVal = this.roleMatrix.getRoleMatrix(identifier, "");
            //                             await this.loanApplicationDataService.executequeryDataServicePromise(checkVal).then(
            //                                 async (checkValResults)=> {
                                                
            //                                     if(checkValResults.Count > 0)
            //                                     { 
            //                                        let filterRole = [];
            //                                        for (let item in uniqueRole)
            //                                        {
            //                                             for(let valR in checkValResults.Items)
            //                                             {
                                                    
            //                                                 if(uniqueRole[item]==checkValResults.Items[valR].roleNm)
            //                                                 {
            //                                                     filterRole.push(uniqueRole[item])
            //                                                 }
            //                                             }
            //                                        }
                                                
            //                                     let filterRoleLength = filterRole.length;
                                                

            //                                     if(filterRoleLength == 0)
            //                                     {
            //                                          let msg = {
            //                                                     message: "NoRecords"
            //                                                 }
            //                                                 observer.next(msg);
            //                                                 observer.complete();
            //                                     }
            //                                     else {
            //                                         for(let role in filterRole)
            //                                         {
            //                                         let identifierParams : any;
            //                                         if(identifier == "reviewer")
            //                                         {
            //                                             identifierParams  = this.formParams.getFormReviewer(filterRole[role]);
            //                                         }
            //                                         else if(identifier == "approver")
            //                                         {
            //                                             identifierParams  = this.formParams.getFormApprover(filterRole[role]);
            //                                         }
            //                                         await this.loanApplicationDataService.executequeryDataServicePromise(identifierParams).then(
            //                                         async (matrixParamsResults) => {
                                                        
            //                                             if(matrixParamsResults.Count > 0)
            //                                             {
            //                                                 for(let res in matrixParamsResults.Items)
            //                                                 {
                                                                
            //                                                     let queryParams = this.loanApplicationNoSQLParams.getFormId(matrixParamsResults.Items[res].formidval);
                                                                
                                                                
            //                                                     await this.loanApplicationDataService.executequeryDataServicePromise(queryParams).then(
            //                                                         (loanData) => {
            //                                                             for(let item in loanData.Items)
            //                                                                 {
            //                                                                     if(loanData.Items[item].formname = "Affidavit of Undertaking"
            //                                                                     && loanData.Items[item].affidavitUTCurrency == matrixParamsResults.Items[res].detail9
            //                                                                     && Number(loanData.Items[item].affidavitUTAmount) <= Number(matrixParamsResults.Items[res].detail5))
            //                                                                     {
            //                                                                         let loanRequests = {
            //                                                                             id: loanData.Items[item].loankey,
            //                                                                             applicantName: loanData.Items[item].applicantLastNm,
            //                                                                             status: loanData.Items[item].statusVal,
            //                                                                             applicationDate: loanData.Items[item].applicationDate,
            //                                                                             docNumber: loanData.Items[item].docNumber
            //                                                                         }  
            //                                                                         holderObj.push(loanRequests)
            //                                                                     }

            //                                                                     else if(loanData.Items[item].formname = "Affidavit of Co-maker"
            //                                                                     && loanData.Items[item].affivaditCMCurrency == matrixParamsResults.Items[res].detail9
            //                                                                     && Number(loanData.Items[item].affidavitCMAmount) <= Number(matrixParamsResults.Items[res].detail5))
            //                                                                     {
            //                                                                         let loanRequests = {
            //                                                                             id: loanData.Items[item].loankey,
            //                                                                             applicantName: loanData.Items[item].applicantLastNm,
            //                                                                             status: loanData.Items[item].statusVal,
            //                                                                             applicationDate: loanData.Items[item].applicationDate,
            //                                                                             docNumber: loanData.Items[item].docNumber
            //                                                                         }  
            //                                                                         holderObj.push(loanRequests)
            //                                                                     }

            //                                                                     else if(loanData.Items[item].formname = "Promissory Note"
            //                                                                     && loanData.Items[item].promissoryCurrency == matrixParamsResults.Items[res].detail9
            //                                                                     && Number(loanData.Items[item].promissoryAmount) <= Number(matrixParamsResults.Items[res].detail5))
            //                                                                     {
            //                                                                         let loanRequests = {
            //                                                                             id: loanData.Items[item].loankey,
            //                                                                             applicantName: loanData.Items[item].applicantLastNm,
            //                                                                             status: loanData.Items[item].statusVal,
            //                                                                             applicationDate: loanData.Items[item].applicationDate,
            //                                                                             docNumber: loanData.Items[item].docNumber
            //                                                                         }  
            //                                                                         holderObj.push(loanRequests)
            //                                                                     }

            //                                                                 }   
            //                                                         }
            //                                                     )
                                                             
            //                                                 }
                                                            
            //                                             } 
            //                                         }
            //                                        )
            //                                         }
            //                                     }
                                                


            //                                     }
                                                 
            //                                 }
            //                             )
            //                             holderObj.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
            //                         //     holderObj = holderObj.filter((value, index, self) =>
            //                         //     index === self.findIndex((t) => (
            //                         //       t.id === value.id
            //                         //     ))
            //                         //   )
            //                         observer.next(holderObj);
            //                         observer.complete();
            //                     }
            //                     else {
            //                         let msg = {
            //                             message: "NoRecords"
            //                         }
            //                         observer.next(msg);
            //                         observer.complete();
            //                     }
            //                 }
            //             )

            //         }
            //         else {
            //             observer.next(data)
            //             observer.complete();
            //         }
            //     },
            //     (error) => {
    
            //     }
            // )

        })

    }



    public getLoanRequestById(loankey: any, username: any, roleAccess? : any) : Observable<any> {
       
        let queryParams = this.loanApplicationNoSQLParams.viewLoanRequestById(loankey);
        return Observable.create((observer) => {
            console.log("loankey", loankey)
            // this.apiChecker.validatePerLoanKey(username,"processor",loankey).subscribe(
            //     (data) => {
            //         console.log("data", data)
                    // if(data.message == "authorized")
                    // {

                        this.apiChecker.isValidUserPerModule(username, roleAccess).subscribe(
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
                            }
                        )

                       
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
                                                // console.log("insert loan", data)
                                                // this.auditSvc.insertIntoAuditTbl(
                                                //     loankey, 
                                                //     "Processed",
                                                //     "Create New Loan Application",
                                                //     obj.data.createdBy,
                                                //     currentDate
                                                //     ).subscribe(
                                                //         (data) => {            
                                                //             let msg = {
                                                //                 message: "createdLoan"
                                                //             }
                                                //             observer.next(msg);
                                                //             observer.complete();
                                                //         }   
                                                //     )

                                                    let msg = {
                                                        message: "createdLoan",
                                                        docNumber: loankey
                                                    }
                                                    observer.next(msg);
                                                    observer.complete();
                                                
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
                                    let loankey = this.generateKey(obj.data.selectedRangeData.formid,Number(obj.data.selectedRangeData.detail3), true)
                                    let insertParams = this.loanApplicationNoSQLParams.insertIntoUserTable(obj,loankey,obj.data.selectedRangeData.formid, obj.data.selectedRangeData.detail3);
                                    
                                    this.loanApplicationDataService.InsertData(insertParams).subscribe(
                                                (data) => {
                                                    //insert into audit table
                                                    // console.log("insert loan", data)
                                                    // this.auditSvc.insertIntoAuditTbl(
                                                    //     loankey, 
                                                    //     "Processed",
                                                    //     "Create New Loan Application",
                                                    //     obj.data.createdBy,
                                                    //     currentDate
                                                    //     ).subscribe(
                                                    //         (data) => {            
                                                    //             let msg = {
                                                    //                 message: "createdLoan"
                                                    //             }
                                                    //             observer.next(msg);
                                                    //             observer.complete();
                                                    //         }   
                                                    //     )
                                                    let msg = {
                                                        message: "createdLoan",
                                                        docNumber: loankey
                                                    }
                                                    observer.next(msg);
                                                    observer.complete();
                                                    
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

    public updateLoanTransaction(obj: any, role: any) : Observable<any> {

        let queryParams = this.loanApplicationNoSQLParams.updateLoanTransaction(obj, role);
        let commentsParams = this.loanApplicationNoSQLParams.insertCommentsTbl(obj, role);
        return Observable.create((observer) => {
            this.loanApplicationDataService.executeupdate(queryParams).subscribe(
                (data) => {

                    this.loanApplicationDataService.InsertData(commentsParams).subscribe(
                        (data) => {
                            let msg = {
                                message: "updateLoanTransaction"
                            }
                            observer.next(msg);
                            observer.complete();
                            
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

    public updateLoantransByProcessor(obj: any) : Observable<any> {
        
        let queryParams = this.loanApplicationNoSQLParams.updateLoanTransByProcessor(obj);
        console.log("queryParams", queryParams)
        let commentsParams = this.loanApplicationNoSQLParams.insertCommentsTbl(obj, "processor");
        return Observable.create((observer) => {
            this.loanApplicationDataService.executeupdate(queryParams).subscribe(
                (data) => {

                    this.loanApplicationDataService.InsertData(commentsParams).subscribe(
                        (data) => {
                            let msg = {
                                message: "updateLoanTransaction"
                            }
                            observer.next(msg);
                            observer.complete();
                            
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

    public getCommentsHistory(loankey: any) : Observable<any> {
       
        let getLoan = this.loanApplicationNoSQLParams.viewLoanRequestById(loankey);
        let queryParams = this.loanApplicationNoSQLParams.getCommentsHistorybyId(loankey);
        return Observable.create((observer) => {

            // this.loanApplicationDataService.executequeryDataService(getLoan).subscribe(
            //     (data) => {
            //         if(data.Count > 0)
            //         {
                        
                        // if(data.Items[0].isForRelease == '1')
                        // {
                        //     queryParams = this.loanApplicationNoSQLParams.getCommentsHistorybyRelease(loankey);
                        // }
                        this.loanApplicationDataService.executequeryDataService(queryParams).subscribe(
                            (data) => {
                                let objData = []
                                const sortedAsc = data.Items.sort(
                                    (objA, objB) => Number(new Date(objA.audit)) - Number(new Date(objB.audit)),
                                  );

                                observer.next(sortedAsc)
                                observer.complete();

                               
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
            //         }
            //     }
            // )

                                    
          
         })

    }

    public calculateNetProceeds(objData: any) : Observable<any> {
        return Observable.create((observer) => {

            let interestAmount = objData.data.loanAmount * (objData.data.interest / 100);
            let totalAmount = parseFloat(objData.data.balance) + parseFloat(objData.data.servicefee) + parseFloat(objData.data.insurance) + parseFloat(objData.data.othercharges) + interestAmount + parseFloat(objData.data.loanAmount);
            let retVal = {
                interestAmt: interestAmount,
                netProceeds: Math.round(totalAmount * 100) / 100
            }
            observer.next(retVal);
            observer.complete();
         })

    }

    public updateLoanByRelease(obj: any) : Observable<any> {
        
        let queryParams = this.loanApplicationNoSQLParams.updateLoanByRelease(obj);
        let newObj = {
            data : {
                id: obj.data.id,
                comments: "Create Loan Release Form.",
                role: "release officer",
                status: "Loan Release - For Processing",
                user: obj.data.user
            }
        }
        let commentsParams = this.loanApplicationNoSQLParams.insertCommentsTbl(newObj, "release officer", true);
        return Observable.create((observer) => {
                
            this.loanApplicationDataService.executeupdate(queryParams).subscribe(
                (data) => {

                    this.loanApplicationDataService.InsertData(commentsParams).subscribe(
                        (data) => {
                            let msg = {
                                message: "updateLoanTransaction"
                            }
                            observer.next(msg);
                            observer.complete();
                            
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


}