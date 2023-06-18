import { Observable } from 'rxjs/Observable';
import {LoanReportNoSQLParams} from '../business-service/reportparams';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanReportBusinessService} from './loan-report-business-service';
var dateFormat = require('dateformat');


export class LoanPaymentReceiptBusinessService {
    private reportParams = new LoanReportNoSQLParams();
    private loanApplicationDataService = new LoanApplicationDataService();
    private loanLogic = new LoanReportBusinessService();
    constructor() {

    }

    public generatePaymentReceipt(objData: any) : Observable<any> {
        let loanObj = [];
        let allObj = [];
        let filterAppCode : any;
        let filterdocNumber: any;

        return Observable.create(async (observer) => {

               let queryParams = this.reportParams.getLoanAppByCompanyByStatus(objData.data.company.code);
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


            allObj = loanObj;
        //    filter applicant code
           if(objData.data.applicantCode.value != "")
           {
               console.log("with applicant")
               filterAppCode = this.loanLogic.singleFilterApplicantCode(loanObj, objData.data);
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

           //filter doc number
           if(objData.data.docNumber.length > 0)
           {
               console.log("with docnumber")
               if(allObj.length > 0)
               {
                   filterdocNumber = this.loanLogic.filterDocNumber(allObj, objData.data);
               }
               else {
                   filterdocNumber = this.loanLogic.filterDocNumber(loanObj, objData.data);
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
           let filterAllObj = [];

           if(allObj.length > 0)
           {
            
                for(let val in allObj)
                {
                    
                    let filterData = this.reportParams.getAllLoanReceiveDataByLoanKeyReverseInd(allObj[val].loankey);
                    await this.loanApplicationDataService.executequeryDataServicePromise(filterData).then(
                        (data) => {
                            if(data.Count >0)
                            {
                                filterAllObj = data.Items;
                            }
                        }
                    )
                }
           }

           let returnCalObj = [];

           if(filterAllObj.length > 0)
           {
                for(let item in filterAllObj)
                {
                    if(filterAllObj[item].statusVal != "Fully paid" && filterAllObj[item].statusVal != "Cleared" && filterAllObj[item].isForPayment != "1")
                    {
                        let newObj = this.getReturnValue(filterAllObj[item], objData)
                        returnCalObj.push(newObj);
                    }
                   
                }
                if(returnCalObj.length > 0)
                {
                    let newObj1 = this.getReturnValueEmpty("Total amount selected for payment", true)
                    returnCalObj.push(newObj1);
    
                    let newObj2 = this.getReturnValueEmpty("Total amount received", false)
                    returnCalObj.push(newObj2);
    
                    let newObj3 = this.getReturnValueEmpty("Unapplied payment", true)
                    returnCalObj.push(newObj3);
                }
           
                
                observer.next(returnCalObj);
                observer.complete();
           }
           else {
                let retObject = []
                observer.next(retObject);
                observer.complete();
           }

          

    })

    }

    private getReturnValue(allObj,uiObject)
    {
        if(allObj.remarksVal == "Previous outstanding balance" || allObj.remarksVal == "Interest Paid")
        {
            if(Number(allObj.amountPaid) > 0)
            {
                allObj.amountPaid = "-" + allObj.amountPaid
            }
        }

        let newAmount = Number(allObj.amountVal).toFixed(2);
        let retObject = {
            id: allObj.id,
            loankey: allObj.loankey,
            applicantCode: allObj.applicantFirstNm,
            applicantName: allObj.applicantLastNm,
            loanForm: allObj.docNumber,
            amount: allObj.remarksVal == "Previous outstanding balance" || allObj.remarksVal == "Interest Paid" ? "-" + newAmount.toString() : newAmount.toString(),
            currency: allObj.promissoryCurrency,
            remarks: allObj.remarksVal,
            paymentDate: uiObject.data.paymentDate,
            paymentReference: uiObject.data.paymentReference,
            paymentCurrency: uiObject.data.currencySelect.code,
            exchangeRate: uiObject.data.exchangeRate,
            companyCurrency: uiObject.data.company.currency,
            amountPaid: "",
            isAmountPaidDisabled: false,
            amountPaid2: allObj.amountPaid == undefined ? "" : allObj.amountPaid,
            oldAmountPaid2: allObj.amountPaid == undefined ? "" : allObj.amountPaid,
            isAmountPaid2Disabled: true,
            paymentStatus: allObj.statusVal == undefined ? "" : allObj.statusVal,
            isWithChange: false,
            displayMessage: "",
            paymentDoc: allObj.paymentDoc,
            dummy: false,
            disabledCheckbox: false
        }

        return retObject;
    }

    private getReturnValueEmpty(id, enabledField: any)
    {
        let retObject = {
            id: "",
            loankey: "",
            applicantCode: "",
            applicantName:id,
            loanForm: "",
            amount: "",
            currency: "",
            remarks: "",
            paymentDate: "",
            paymentReference: "",
            paymentCurrency:"",
            exchangeRate: "",
            companyCurrency: "",
            amountPaid: "",
            isAmountPaidDisabled: enabledField,
            amountPaid2: true,
            isAmountPaid2Disabled: true,
            paymentStatus: "",
            isWithChange: "",
            displayMessage: "",
            paymentDoc: "",
            dummy: true,
            disabledCheckbox: true
        }

        return retObject;
    }

    public postPayments(objData: any) : Observable<any> {

        //include payment date
        //history for the payment
        let numberRange = objData.data.numberRange;
        return Observable.create(async (observer) => {
            let isWithDocNumber : any = false; 
            let paymentDocNUmber: any;
            let notProceed : any = false;
            let filterData = this.reportParams.getLastPaymentDocumentNbr(numberRange.companyCd);
            let idForUpdate: any;
            let count: any;
            let isFirstTime: any = false;
            await this.loanApplicationDataService.executequeryDataServicePromise(filterData).then(
                    (data) => {
                            if(data.Count >0)
                            {
                                if(Number(numberRange.rangeTo) == data.Items[0].countVal)
                                {
                                    notProceed = true;
                                    let retObject = {
                                        message: "reachedMax"
                                    }
                                    observer.next(retObject);
                                    observer.complete();
                                }
                                else {
                                    let newVal : any;
                                    idForUpdate = data.Items[0].id;
                                    newVal = Number(data.Items[0].countVal) + 1;
                                    count = newVal;
                                    paymentDocNUmber = numberRange.companyCd + "-" + newVal.toString();
                                }
                            }else {
                                count = numberRange.rangeFrom;
                                isFirstTime = true;
                                paymentDocNUmber = numberRange.companyCd + "-" + numberRange.rangeFrom;
                            }
                }
            )

            if(!notProceed)
            {
                for(let item in objData.data.object)
                {
                   
                    if(objData.data.object[item].dummy == false)
                    {
                       
                        let newParams = this.reportParams.updateLoanReceivableForPostPayments(objData.data.object[item], paymentDocNUmber);

                        await this.loanApplicationDataService.executequeryUpdateServicePromise(newParams).then(
                            (data) => {
                            },
                            (error) => {
                                console.log("error update loan receiv table")
                            }
                        )
    
                        if(objData.data.object[item].paymentStatus == "Fully paid" || objData.data.object[item].paymentStatus == "Partially paid")
                        {
                            let getRecords = this.reportParams.getLoanReceivableReportById(objData.data.object[item].id);
                            await this.loanApplicationDataService.executequeryDataServicePromise(getRecords).then(
                                async (existingRec) => {
                                    if(existingRec.Count > 0)
                                    {
                                        let remarks: any;
                                        let status: any;
                                        if((objData.data.object[item].remarks == "Loan Receivable"))
                                        {
                                            remarks = "Loan Repayment";
                                        }
                                        else if((objData.data.object[item].remarks == "Interest Receivable"))
                                        {
                                            remarks = "Interest Paid";
                                        }
                                        else if((objData.data.object[item].remarks == "Pro-rated Interest"))
                                        {
                                            remarks = "Pro-rated Interest Paid";
                                        }
                                        else {
                                            remarks = objData.data.object[item].remarks;
                                        }
    
                                        if(objData.data.object[item].paymentStatus == "Fully paid")
                                        {
                                            // if((remarks == "Previous outstanding balance" || remarks == "Interest Paid"))
                                            // {
                                            //     status = "Cleared"
                                            // }
                                            // else {
                                                status = objData.data.object[item].paymentStatus;
                                            // }
                                        }
                                        else {
                                            status = objData.data.object[item].paymentStatus;
                                        }
                                        
                                        if((objData.data.object[item].isWithChange) && (remarks != "Previous outstanding balance" && remarks != "Interest Paid"))
                                        {
                                            let insertLoanReceivByPayment = this.reportParams.insertIntoReceivableReportTblByPostPayment(existingRec.Items[0],remarks,status,newParams,objData.data.object[item],paymentDocNUmber);
                                            await this.loanApplicationDataService.executequeryInsertServicePromise(insertLoanReceivByPayment).then(
                                            (data) => {
                                            },
                                            (error) => {
                                                console.log("error insert - payment doc number table")
                                            }
                                        )
                                        }
                                        
                                    }
                                })
                        }
                    }
                  
                    
                }
                // insert paymentDocNUmber
                let insertPaymentDoc = this.reportParams.insertIntoPaymentDocumentNbr(numberRange.companyCd, count);
                await this.loanApplicationDataService.executequeryInsertServicePromise(insertPaymentDoc).then(
                    (data) => {
                    },
                    (error) => {
                        console.log("error insert - payment doc number table")
                    }
                    )
                // update last indicator to 0
                if(!isFirstTime)
                {
                    let updateDocNumber = this.reportParams.updatePaymentDocumentNbr(idForUpdate);
                    await this.loanApplicationDataService.executequeryUpdateServicePromise(updateDocNumber).then(
                        (data) => {
                        },
                        (error) => {
                            console.log("error update  payment doc number table")
                        }
                    )
                }
                
            
                    let retObject = {
                        message: "success"
                    }
                    observer.next(retObject);
                    observer.complete();
            }

           
          

    })

    }


}