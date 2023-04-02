import { Observable } from 'rxjs/Observable';
import {LoanReportNoSQLParams} from '../business-service/reportparams';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
var dateFormat = require('dateformat');


export class LoanReportBusinessService {
    private reportParams = new LoanReportNoSQLParams();
    private loanApplicationDataService = new LoanApplicationDataService();

    constructor() {

    }


    public generateLoanAppReport(objData: any) : Observable<any> {
         let loanObj = [];
         let companyOjb = [];
         let allObj = [];
         let filterAppCodeObject = [];
         let filterAppCode : any;
         var dateToday=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
         let filterComakerObject = [];
         let filterCoMakerCode : any;
         let filterStatus : any;
         let filterCollectionGroup: any;
         let filterCollectionAgent: any;
         let filterAppDate: any;
         let isComaker : any = false;
         return Observable.create(async (observer) => {

            for(let comp in objData.data.company)
            {

                let queryParams = this.reportParams.getLoanAppByCompany(objData.data.company[comp].code);
                await this.loanApplicationDataService.executequeryDataServicePromise(queryParams).then(
                    (data) => {
                        console.log("completed")
                        if(data.Count >0)
                        {
                            for (let companyRes in data.Items)
                            {
                                loanObj.push(data.Items[companyRes])
                            }
                        }
                    }
                )
            }

            if(objData.data.applicantCode == "" && objData.data.coMakerCode == "" && objData.data.appFomDate == "" && objData.data.collectionGroup == "" && objData.data.collectonAgent == "" && objData.data.status == "")
            {
                // for(let item in loanObj)
                // {
                //     let newAmount : any;
                //     let newCurrency: any;
                //     let collateral: any;
                //     let detail1: any;
                //     let detail2: any;

                //     if(loanObj[item].formname == "Promissory Note")
                //     {
                //         newAmount = loanObj[item].promissoryAmount;
                //         newCurrency = loanObj[item].promissoryCurrency;
                //         collateral = "";
                //         detail1 = "";
                //         detail2 = "";
                //     }
                //     else if(loanObj[item].formname == "Affidavit of Co-maker")
                //     {
                //         newAmount = loanObj[item].affidavitCMAmount;
                //         newCurrency = loanObj[item].affivaditCMCurrency;
                //         collateral = loanObj[item].affidavitCMTypeValue;
                //         detail1 = loanObj[item].affidavitCMDetail1;
                //         detail2 = loanObj[item].affidavitCMDetail2;
                //     }

                //     else if(loanObj[item].formname == "Affidavit of Undertaking")
                //     {
                //         newAmount = loanObj[item].affidavitUTAmount;
                //         newCurrency = loanObj[item].affidavitUTCurrency
                //         collateral = loanObj[item].affidavitUTTypeValue;
                //         detail1 = loanObj[item].affidavitUTDetail1;
                //         detail2 = loanObj[item].affidavitUTDetail2;
                //     }

                //     let newObj = {
                //         applicantCode: loanObj[item].applicantFirstNm,
                //         applicantName: loanObj[item].applicantLastNm,
                //         coMakerCode: loanObj[item].comakerFirstNm,
                //         coMakerName: loanObj[item].comakerLastNm,
                //         company: loanObj[item].addtlCompanyValue,
                //         applicationDate: loanObj[item].applicationDate == '0-0-0' ? "" : dateFormat(loanObj[item].applicationDate, "yyyy-mm-dd"),
                //         loanForm: loanObj[item].docNumber,
                //         appStatus: loanObj[item].statusVal,
                //         processor: loanObj[item].createdBy,
                //         collectionGroup: loanObj[item].addtlCollectionGroupValue,
                //         collectionAgency: loanObj[item].addtlCollectionAgentValue,
                //         amount: newAmount,
                //         currency: newCurrency,
                //         dateOfLoan: loanObj[item].promissoryDateOfLoan == '0-0-0' ? "" : dateFormat(loanObj[item].promissoryDateOfLoan, "yyyy-mm-dd"),
                //         loanPurpose: loanObj[item].promissoryLoanPurpose,
                //         interestRate: loanObj[item].promissoryInterestRate,
                //         interestScheme: loanObj[item].promissorySchemeValue,
                //         paymentTerm: loanObj[item].promissoryPaymentTermValue,
                //         collateral: collateral,
                //         detail1: detail1,
                //         detail2: detail2,
                //         link1: loanObj[item].promissoryLinkForm1,
                //         link2: loanObj[item].promissoryLinkForm2
                //     }
                //     allObj.push(newObj);
                // }

                // let retval = {
                //     report : allObj,
                //     title: "Loan Application Report",
                //     generatedDate: dateToday 
                // }
                // observer.next(retval);
                // observer.complete();
                allObj = loanObj;
            }
            

            //filter applicant code
            if(objData.data.applicantCode != "")
            {
                console.log("with applicant")
                filterAppCode = this.filterApplicantCode(loanObj, objData.data);
                if(filterAppCode.length > 0)
                {
                    allObj = new Array();
                    allObj = filterAppCode;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }      
            }
            //filter comaker code
            if(objData.data.coMakerCode != "")
            {
                console.log("with comaker")
                if(allObj.length > 0)
                {
                    filterCoMakerCode = this.filterComakerCode(allObj, objData.data);
                }
                else {
                    filterCoMakerCode = this.filterComakerCode(loanObj, objData.data);
                }   

                if(filterCoMakerCode.length > 0)
                {
                    allObj = new Array();
                    allObj = filterCoMakerCode;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }

            //filter Status

            if(objData.data.status != "")
            {
                console.log("with status")
                if(allObj.length > 0)
                {
                    filterStatus = this.filterStatus(allObj, objData.data);
                }
                else {
                    filterStatus = this.filterStatus(loanObj, objData.data);
                }   

                if(filterStatus.length > 0)
                {
                    allObj = new Array();
                    allObj = filterStatus;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }

            //filter collection group
            if(objData.data.collectionGroup != "")
            {
                console.log("with collection group")
                if(allObj.length > 0)
                {
                    filterCollectionGroup = this.filterCollectionGroup(allObj, objData.data);
                }
                else {
                    filterCollectionGroup = this.filterCollectionGroup(loanObj, objData.data);
                }   

                if(filterCollectionGroup.length > 0)
                {
                    allObj = new Array();
                    allObj = filterCollectionGroup;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }
            
             //filter collection agent
             if(objData.data.collectonAgent != "")
             {
                 console.log("with collection agent")
                 if(allObj.length > 0)
                 {
                     filterCollectionAgent = this.filterCollectionAgent(allObj, objData.data);
                 }
                 else {
                    filterCollectionAgent = this.filterCollectionAgent(loanObj, objData.data);
                 }   
 
                 if(filterCollectionAgent.length > 0)
                 {
                     allObj = new Array();
                     allObj = filterCollectionAgent;
                 }
                 else {
                     let retObject = []
                     observer.next(retObject);
                     observer.complete();
                 }          
   
             }

             //filter app date
             if(objData.data.appFomDate != "")
             {
                 if(allObj.length > 0)
                 {
                     filterAppDate = this.filterAppDate(allObj, objData.data);
                 }
                 else {
                    filterAppDate = this.filterAppDate(loanObj, objData.data);
                 }   
 
                 if(filterAppDate.length > 0)
                 {
                     allObj = new Array();
                     allObj = filterAppDate;
                 }
                 else {
                     let retObject = []
                     observer.next(retObject);
                     observer.complete();
                 }          
   
             }


            
            allObj = allObj.filter((value, index, self) =>
                   index === self.findIndex((t) => (
                   t.loankey === value.loankey
              ))
            )

            if(allObj.length > 0 )
            {   
                let returnObj = [];
                for(let item in allObj)
                {
                    let newAmount : any;
                    let newCurrency: any;
                    let collateral: any;
                    let detail1: any;
                    let detail2: any;

                    if(allObj[item].formname == "Promissory Note")
                    {
                        newAmount = allObj[item].promissoryAmount;
                        newCurrency = allObj[item].promissoryCurrency
                        collateral = "";
                        detail1 = "";
                        detail2 = "";
                    }
                    else if(allObj[item].formname == "Affidavit of Co-maker")
                    {
                        newAmount = allObj[item].affidavitCMAmount;
                        newCurrency = allObj[item].affivaditCMCurrency
                        collateral = allObj[item].affidavitCMTypeValue;
                        detail1 = allObj[item].affidavitCMDetail1;
                        detail2 = allObj[item].affidavitCMDetail2;
                    }

                    else if(allObj[item].formname == "Affidavit of Undertaking")
                    {
                        newAmount = allObj[item].affidavitUTAmount;
                        newCurrency = allObj[item].affidavitUTCurrency
                        collateral = allObj[item].affidavitUTTypeValue;
                        detail1 = allObj[item].affidavitUTDetail1;
                        detail2 = allObj[item].affidavitUTDetail2;
                    }

                    let newObj = {
                        applicantCode: allObj[item].applicantFirstNm,
                        applicantName: allObj[item].applicantLastNm,
                        coMakerCode: allObj[item].comakerFirstNm,
                        coMakerName: allObj[item].comakerLastNm,
                        company: allObj[item].addtlCompanyValue,
                        applicationDate: allObj[item].applicationDate == '0-0-0' ? "" :dateFormat(allObj[item].applicationDate, "yyyy-mm-dd"),
                        loanForm: allObj[item].docNumber,
                        appStatus: allObj[item].statusVal,
                        processor: allObj[item].createdBy,
                        collectionGroup: allObj[item].addtlCollectionGroupValue,
                        collectionAgency: allObj[item].addtlCollectionAgentValue,
                        amount: newAmount,
                        currency: newCurrency,
                        dateOfLoan: allObj[item].promissoryDateOfLoan == '0-0-0' ? "" : dateFormat(allObj[item].promissoryDateOfLoan, "yyyy-mm-dd"),
                        loanPurpose: allObj[item].promissoryLoanPurpose,
                        interestRate: allObj[item].promissoryInterestRate,
                        interestScheme: allObj[item].promissorySchemeValue,
                        paymentTerm: allObj[item].promissoryPaymentTermValue,
                        collateral: collateral,
                        detail1: detail1,
                        detail2: detail2,
                        link1: allObj[item].promissoryLinkForm1,
                        link2: allObj[item].promissoryLinkForm2
                    }
                    returnObj.push(newObj);
                }
                let retval = {
                    report : returnObj,
                    title: "Loan Application Report",
                    generatedDate: dateToday 
                }
                observer.next(retval);
                observer.complete();
            }
            else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
            
            }

            

            
         })
 
     }

     //filter 
     public filterApplicantCode(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.applicantCode)
                {
                    if(objdata[item].applicantFirstNm == UIobject.applicantCode[filter].value)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        
        return newObj;
     }

     public filterComakerCode(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.coMakerCode)
                {
                    if(objdata[item].comakerFirstNm == UIobject.coMakerCode[filter].value)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        return newObj;
     }

     public filterStatus(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.status)
                {
                   
                    if(objdata[item].statusVal == UIobject.status[filter].value)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        return newObj;
     }

     public filterCollectionGroup(objdata: any, UIobject: any) {
        let newObj = [];
            for(let item in objdata)
            {
                for(let filter in UIobject.collectionGroup)
                {

                    if(objdata[item].addtlCollectionGroup == UIobject.collectionGroup[filter].code)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        return newObj;
     }

     public filterCollectionAgent(objdata: any, UIobject: any) {
        let newObj = [];
            for(let item in objdata)
            {
                for(let filter in UIobject.collectonAgent)
                {

                    if(objdata[item].addtlCollectionAgent == UIobject.collectonAgent[filter].code)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        return newObj;
     }

     public filterAppDate(objdata: any, UIobject: any) {
        let newObj = [];
            for(let item in objdata)
            {
                const uiFromDate = dateFormat(UIobject.appFomDate, "yyyy-mm-dd");
                let convUiFromDate = new Date(uiFromDate)

                const uiToDate = dateFormat(UIobject.appToDate, "yyyy-mm-dd");
                let convUiToDate = new Date(uiToDate)

                const loanAppDate = dateFormat(objdata[item].applicationDate, "yyyy-mm-dd");
                let convLoanAppDate = new Date(loanAppDate)

                if(convLoanAppDate >= convUiFromDate && convLoanAppDate <= convUiToDate)
                {
                    newObj.push(objdata[item])
                }
                
            }
        return newObj;
     }

}