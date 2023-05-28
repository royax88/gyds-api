var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class TriggerBatchNoSQLParams {

    public chargeReportTbl: string;
    public  tblNmL: string;
    public receivableReportTbl: string;
    constructor() {
        this.setNoSqlTables();
    }


    public insertIntoChargeReportTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.chargeReportTbl,
        Item: {
            'id' : uuidv4(),
            'loankey' : obj.loankey,
            'addtlCompany': obj.addtlCompany,
            'addtlCompanyValue': obj.addtlCompanyValue,
            'applicantFirstNm': obj.applicantFirstNm,
            'applicantLastNm': obj.applicantLastNm,
            'LRloanReleaseDt': obj.LRloanReleaseDt,
            'docNumber': obj.docNumber,
            'updatedBy': obj.updatedBy,
            'amountVal': obj.amountVal,
            'promissoryCurrency': obj.promissoryCurrency,
            'remarksVal': obj.remarks,
            'createdDate': day
            
        }
        };
        return finalParams;
    }

    public insertIntoReceivableReportTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.receivableReportTbl,
        Item: {
            'id' : uuidv4(),
            'loankey' : obj.loankey,
            'addtlCompany': obj.addtlCompany,
            'addtlCompanyValue': obj.addtlCompanyValue,
            'applicantFirstNm': obj.applicantFirstNm,
            'applicantLastNm': obj.applicantLastNm,
            'comakerFirstNm': obj.comakerFirstNm,
            'comakerLastNm': obj.comakerLastNm,
            'applicationDate': obj.applicationDate,
            'LRloanReleaseDt': obj.LRloanReleaseDt,
            'docNumber': obj.docNumber,
            'updatedBy': obj.updatedBy,
            'addtlCollectionGroup': obj.addtlCollectionGroup,
            'addtlCollectionGroupValue': obj.addtlCollectionGroupValue,
            'addtlCollectionAgent': obj.addtlCollectionAgent,
            'addtlCollectionAgentValue': obj.addtlCollectionAgentValue,
            'amountVal': obj.amountVal,
            'remarksVal': obj.remarks,
            'promissoryInterestRate': obj.promissoryInterestRate,
            'promissoryScheme': obj.promissoryScheme,
            'promissorySchemeValue': obj.promissorySchemeValue,
            'promissoryPaymentTerm': obj.promissoryPaymentTerm,
            'promissoryPaymentTermValue': obj.promissoryPaymentTermValue,
            'promissoryCurrency': obj.promissoryCurrency,
            'createdDate': day,
            'isLastIndicator': '1',
            'statusVal' : "Released",
            'isForPayment' : "0",
            'isReverseIndicator' : "0"
        }
        };
        return finalParams;
    }


    private setNoSqlTables() {

        this.chargeReportTbl = "gyds-lms-loan-charge-report-" + process.env['environment_tag'];
        this.receivableReportTbl = "gyds-lms-loan-receivable-report-" + process.env['environment_tag'];
    }
    
}

