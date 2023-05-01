import { Observable } from 'rxjs/Observable';
import {triggerBatchDataService} from '../data-service/trigger-batch-data-service';
import {TriggerBatchNoSQLParams} from './nosqlparams';
var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class TriggerBatchBusinessService {

    private triggerBatchDataService = new triggerBatchDataService();
    private triggerBatchNoSQLParams = new TriggerBatchNoSQLParams();
    constructor() {

    }

    public processLoanReleaestransaction(objData: any) : Observable<any> {
       
        let chargeReportObj = this.processLoanChargeReport(objData);
        let receivableReportObj = this.processLoanReceivableReport(objData);

        return Observable.create(async (observer) => {

            try {
                for(let item in chargeReportObj)
                {

                    let queryParams = this.triggerBatchNoSQLParams.insertIntoChargeReportTbl(chargeReportObj[item]);
                    await this.triggerBatchDataService.executequeryInsertServicePromise(queryParams).then(
                        (data) => {
                            console.log("sucessful insert - loan charge table")
                        },
                        (error) => {
                            console.log("error insert - loan charge table")
                        }
                    )
                }

                for(let item in receivableReportObj)
                {

                    let queryParams = this.triggerBatchNoSQLParams.insertIntoReceivableReportTbl(receivableReportObj[item]);
                    await this.triggerBatchDataService.executequeryInsertServicePromise(queryParams).then(
                        (data) => {
                            console.log("sucessful insert - loan receivable table")
                        },
                        (error) => {
                            console.log("error insert - loan receivable table")
                        }
                    )
                }

            console.log("done");
            observer.next("completed")
            observer.complete();
            }
            catch(err)
            {
                console.log("error", err);
                observer.next("error")
                observer.complete();
            }
            
        })



    }

    public returnSkip() : Observable<any> {

        return Observable.create( (observer) => {
            observer.next("loan not released");
            observer.complete();
        })
    }

    public returnError() : Observable<any> {

        return Observable.create( (observer) => {
            observer.next("Error Handler");
            observer.complete();
        })
    }

    processLoanChargeReport(objData: any)
    {
        let newArr = [];
        let newobj1 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber:  objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            amountVal: objData.LRserviceFee.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Service Fee"
           }
        
           let newobj2 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber:  objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            amountVal: objData.LRinsuranceVal.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Insurance"
           }

           let newobj3 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber:  objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            amountVal: objData.LRothercharges.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Other Charges"
           }

           newArr.push(newobj1);
           newArr.push(newobj2);
           newArr.push(newobj3);

           return newArr;
    }

    processLoanReceivableReport(objData: any)
    {
        let newArr = []; 
        let newObj1 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            comakerFirstNm: objData.comakerFirstNm.S,
            comakerLastNm: objData.comakerLastNm.S,
            applicationDate: objData.applicationDate.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber: objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            addtlCollectionGroup: objData.addtlCollectionGroup.S,
            addtlCollectionGroupValue: objData.addtlCollectionGroupValue.S,
            addtlCollectionAgent: objData.addtlCollectionAgent.S,
            addtlCollectionAgentValue: objData.addtlCollectionAgentValue.S,
            amountVal: objData.promissoryAmount.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Loan Receivable",
            promissoryInterestRate: objData.promissoryInterestRate.S,
            promissoryScheme: objData.promissoryScheme.S,
            promissorySchemeValue: objData.promissorySchemeValue.S,
            promissoryPaymentTerm: objData.promissoryPaymentTerm.S,
            promissoryPaymentTermValue: objData.promissoryPaymentTermValue.S
           }

           let newObj2 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            comakerFirstNm: objData.comakerFirstNm.S,
            comakerLastNm: objData.comakerLastNm.S,
            applicationDate: objData.applicationDate.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber: objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            addtlCollectionGroup: objData.addtlCollectionGroup.S,
            addtlCollectionGroupValue: objData.addtlCollectionGroupValue.S,
            addtlCollectionAgent: objData.addtlCollectionAgent.S,
            addtlCollectionAgentValue: objData.addtlCollectionAgentValue.S,
            amountVal: objData.LRinterestAmt.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Interest Paid",
            promissoryInterestRate: objData.promissoryInterestRate.S,
            promissoryScheme: objData.promissoryScheme.S,
            promissorySchemeValue: objData.promissorySchemeValue.S,
            promissoryPaymentTerm: objData.promissoryPaymentTerm.S,
            promissoryPaymentTermValue: objData.promissoryPaymentTermValue.S
             }

           let newObj3 = {
            loankey: objData.loankey.S,
            addtlCompany: objData.addtlCompany.S,
            addtlCompanyValue: objData.addtlCompanyValue.S,
            applicantFirstNm: objData.applicantFirstNm.S,
            applicantLastNm: objData.applicantLastNm.S,
            comakerFirstNm: objData.comakerFirstNm.S,
            comakerLastNm: objData.comakerLastNm.S,
            applicationDate: objData.applicationDate.S,
            LRloanReleaseDt: objData.LRloanReleaseDt.S, 
            docNumber: objData.docNumber.S,
            updatedBy: objData.updatedBy.S,
            addtlCollectionGroup: objData.addtlCollectionGroup.S,
            addtlCollectionGroupValue: objData.addtlCollectionGroupValue.S,
            addtlCollectionAgent: objData.addtlCollectionAgent.S,
            addtlCollectionAgentValue: objData.addtlCollectionAgentValue.S,
            amountVal: objData.LRoutstandingBalance.S,
            promissoryCurrency: objData.promissoryCurrency.S,
            remarks: "Previous outstanding balance",
            promissoryInterestRate: objData.promissoryInterestRate.S,
            promissoryScheme: objData.promissoryScheme.S,
            promissorySchemeValue: objData.promissorySchemeValue.S,
            promissoryPaymentTerm: objData.promissoryPaymentTerm.S,
            promissoryPaymentTermValue: objData.promissoryPaymentTermValue.S
           }

           newArr.push(newObj1);
           newArr.push(newObj2);
           newArr.push(newObj3);

           return newArr;

    }


}