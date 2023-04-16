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

     public filterReleaseDate(objdata: any, UIobject: any) {
        let newObj = [];
            for(let item in objdata)
            {
                const uiFromDate = dateFormat(UIobject.appFomDate, "yyyy-mm-dd");
                let convUiFromDate = new Date(uiFromDate)

                const uiToDate = dateFormat(UIobject.appToDate, "yyyy-mm-dd");
                let convUiToDate = new Date(uiToDate)

                const releaseDate = dateFormat(objdata[item].LRloanReleaseDt, "yyyy-mm-dd");
                let convreleaseDate = new Date(releaseDate)

                if(convreleaseDate >= convUiFromDate && convreleaseDate <= convUiToDate)
                {
                    newObj.push(objdata[item])
                }
                
            }
        return newObj;
     }

     public filterDocNumber(objdata: any, UIobject: any) {
        let newObj = [];
            for(let item in objdata)
            {
                for(let filter in UIobject.docNumber)
                {
                    if(objdata[item].docNumber == UIobject.docNumber[filter].docNumber)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        return newObj;
     }

     public generateLoanChargesReport(objData: any) : Observable<any> {
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
        let filterdocNumber: any;
        let isComaker : any = false;
        return Observable.create(async (observer) => {

           for(let comp in objData.data.company)
           {

               let queryParams = this.reportParams.getLoanAppByCompanyByStatus(objData.data.company[comp].code);
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

           if(objData.data.applicantCode == "" && objData.data.appFomDate == "" && objData.data.docNumber.length == 0)
           {
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


            //filter app date
            if(objData.data.appFomDate != "")
            {
                if(allObj.length > 0)
                {
                    filterAppDate = this.filterReleaseDate(allObj, objData.data);
                }
                else {
                   filterAppDate = this.filterReleaseDate(loanObj, objData.data);
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

            //filter DocNumber
            if(objData.data.docNumber.length > 0)
            {
                console.log("with docnumber")
                if(allObj.length > 0)
                {
                    filterdocNumber = this.filterDocNumber(allObj, objData.data);
                }
                else {
                    filterdocNumber = this.filterDocNumber(loanObj, objData.data);
                }   

                if(filterdocNumber.length > 0)
                {
                    allObj = new Array();
                    allObj = filterdocNumber;
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
               let totalVal: any = 0;
               let returnObj = [];
               let currencyVal : any;
               for(let item in allObj)
               {
                   let newobj1 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    loanReleaseDt: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    docNumber:  allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    amount: allObj[item].LRserviceFee,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Service Fee"
                   }
                   let newobj2 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    loanReleaseDt: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    docNumber:  allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    amount: allObj[item].LRinsuranceVal,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Insurance"
                   }

                   let newobj3 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    loanReleaseDt: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    docNumber:  allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    amount: allObj[item].LRothercharges,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Other Charges"
                   }

                   totalVal = totalVal + Number(newobj1.amount) + Number(newobj2.amount) + Number(newobj3.amount)
                   returnObj.push(newobj1);
                   returnObj.push(newobj2);
                   returnObj.push(newobj3);

                   currencyVal = allObj[item].promissoryCurrency
               }

               let newobj4 = {
                company: "Grand Total By Currency",
                applicantCode: "",
                applicantName: "",
                loanReleaseDt: "",
                docNumber:  "",
                releasedBy: "",
                amount: totalVal,
                currency: currencyVal,
                remarks: ""
               }
               returnObj.push(newobj4);

               let retval = {
                   report : returnObj,
                   title: "Loan Charges Report",
                   generatedDate: dateToday,
                   totalVal: totalVal
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

    public generateLoanReceivableReport(objData: any) : Observable<any> {
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
        let filterdocNumber: any;
        return Observable.create(async (observer) => {

           for(let comp in objData.data.company)
           {

               let queryParams = this.reportParams.getLoanAppByCompanyByStatus(objData.data.company[comp].code);
               await this.loanApplicationDataService.executequeryDataServicePromise(queryParams).then(
                   (data) => {
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

           if(objData.data.applicantCode == "" && objData.data.coMakerCode == "" && objData.data.appFomDate == "" && objData.data.collectionGroup == "" && objData.data.collectonAgent == "" && objData.data.docNumber.length == 0)
           {
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
                    filterAppDate = this.filterReleaseDate(allObj, objData.data);
                }
                else {
                   filterAppDate = this.filterReleaseDate(loanObj, objData.data);
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

            //filter DocNumber
            if(objData.data.docNumber.length > 0)
            {
                console.log("with docnumber")
                if(allObj.length > 0)
                {
                    filterdocNumber = this.filterDocNumber(allObj, objData.data);
                }
                else {
                    filterdocNumber = this.filterDocNumber(loanObj, objData.data);
                }   

                if(filterdocNumber.length > 0)
                {
                    allObj = new Array();
                    allObj = filterdocNumber;
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
           let currencyExcelVal: any;
           if(allObj.length > 0 )
           {   
            let totalVal: any = 0;
            
               let returnObj = [];
               for(let item in allObj)
               {
                   let newObj1 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    coMakerCode: allObj[item].comakerFirstNm,
                    coMakerName: allObj[item].comakerLastNm,
                    applicationDate: dateFormat(allObj[item].applicationDate, "yyyy-mm-dd"),
                    releaseDate: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    loanForm: allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    collectionGroup: allObj[item].addtlCollectionGroupValue,
                    collectionAgency: allObj[item].addtlCollectionAgentValue,
                    amount: allObj[item].promissoryAmount,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Loan Amount",
                    interestRate: allObj[item].promissoryInterestRate,
                    interestScheme: allObj[item].promissorySchemeValue,
                    paymentTerm: allObj[item].promissoryPaymentTermValue,
                   }
                   returnObj.push(newObj1);

                   let newObj2 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    coMakerCode: allObj[item].comakerFirstNm,
                    coMakerName: allObj[item].comakerLastNm,
                    applicationDate: dateFormat(allObj[item].applicationDate, "yyyy-mm-dd"),
                    releaseDate: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    loanForm: allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    collectionGroup: allObj[item].addtlCollectionGroupValue,
                    collectionAgency: allObj[item].addtlCollectionAgentValue,
                    amount: "-" + allObj[item].LRinterestAmt,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Interest Paid",
                    interestRate: allObj[item].promissoryInterestRate,
                    interestScheme: allObj[item].promissorySchemeValue,
                    paymentTerm: allObj[item].promissoryPaymentTermValue,
                   }
                   returnObj.push(newObj2);

                   let newObj3 = {
                    company: allObj[item].addtlCompanyValue,
                    applicantCode: allObj[item].applicantFirstNm,
                    applicantName: allObj[item].applicantLastNm,
                    coMakerCode: allObj[item].comakerFirstNm,
                    coMakerName: allObj[item].comakerLastNm,
                    applicationDate: dateFormat(allObj[item].applicationDate, "yyyy-mm-dd"),
                    releaseDate: dateFormat(allObj[item].LRloanReleaseDt, "yyyy-mm-dd"),
                    loanForm: allObj[item].docNumber,
                    releasedBy: allObj[item].updatedBy,
                    collectionGroup: allObj[item].addtlCollectionGroupValue,
                    collectionAgency: allObj[item].addtlCollectionAgentValue,
                    amount: "-" + allObj[item].LRoutstandingBalance,
                    currency: allObj[item].promissoryCurrency,
                    remarks: "Previous outstanding balance",
                    interestRate: allObj[item].promissoryInterestRate,
                    interestScheme: allObj[item].promissorySchemeValue,
                    paymentTerm: allObj[item].promissoryPaymentTermValue,
                   }
                   returnObj.push(newObj3);

                   totalVal = totalVal + Number(newObj1.amount) - Number(allObj[item].LRinterestAmt) - Number(allObj[item].LRoutstandingBalance)
                   currencyExcelVal = allObj[item].promissoryCurrency
                   
               }

               let newobj4 = {
                company: "Grand Total by Currency",
                    applicantCode: "",
                    applicantName: "",
                    coMakerCode: "",
                    coMakerName: "",
                    applicationDate: "",
                    releaseDate: "",
                    loanForm: "",
                    releasedBy: "",
                    collectionGroup: "",
                    collectionAgency: "",
                    amount: totalVal,
                    currency: currencyExcelVal,
                    remarks: "",
                    interestRate: "",
                    interestScheme: "",
                    paymentTerm: "",
               }
               returnObj.push(newobj4);

               let retval = {
                   report : returnObj,
                   title: "Loan Receivable Report",
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

}