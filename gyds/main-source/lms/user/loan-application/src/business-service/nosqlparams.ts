var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class LoanApplicationNoSQLParams {

    public loanTbl: string;
    public  tblNmL: string;
    constructor() {
        this.setNoSqlTables();
    }


    public insertIntoUserTable(obj:any)
    {
        var CUSTOMEPOCH = 13000; // artificial epoch
        function generateRowId(shardId /* range 0-64 for shard/slot */) {
        var ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
        var randid = Math.floor(Math.random() * 24);
        ts = (ts * 2);   // bit-shift << 6
        ts = ts + shardId;
        return (ts * 6) + randid;
        }
        var newPrimaryHashKey = "formno-" + generateRowId(1);

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        let finalParams: any = {
        TableName: this.loanTbl,
        Item: {
            'loankey' : newPrimaryHashKey,
            'status' : 'processed',
            'applicantLastNm': obj.data.firstAppLastName,
            'applicantFirstNm': obj.data.firstAppFirstName,
            'applicantMiddleNm': obj.data.firstAppMiddleName,
            'applicantCivilStatus': obj.data.firstAppCivilStatus,
            'comakerLastNm': obj.data.firstcoMakerAppLastName,
            'comakerFirstNm': obj.data.firstcoMakerFirstName,
            'comakerMiddleNm': obj.data.firstcoMakerMiddleName,
            'comakerCivilstatus': obj.data.firstcoMakerCivilStatus,
            'addtlCompany': obj.data.firstcompanySelect == undefined || obj.data.firstcompanySelect == "" ? "" : obj.data.firstcompanySelect,
            'addtlCollectionGroup': obj.data.firstcollectionSelect == undefined || obj.data.firstcollectionSelect == "" ? "" : obj.data.firstcollectionSelect.code,
            'addtlCollectionAgent': obj.data.firstcollectionAgentSelect == undefined || obj.data.firstcollectionAgentSelect == "" ? "" : obj.data.firstcollectionAgentSelect.code ,
            'applicationDate': obj.data.firstapplicationDate.year + "-" + obj.data.firstapplicationDate.month + "-" + obj.data.firstapplicationDate.day,
            'affidavitUTAmount' : obj.data.secondAmount,
            'affidavitUTCurrency': obj.data.secondCurrency,
            'affidavitUTInwords': obj.data.secondInwords,
            'affidavitUTType': obj.data.secondundertakingTypeselect == undefined || obj.data.secondundertakingTypeselect == "" ? "" : obj.data.secondundertakingTypeselect.code,
            'affidavitUTDetail1' : obj.data.secondDetail1,
            'affidavitUTDetail2' : obj.data.secondDetail2,
            'affidavitCMAmount' : obj.data.thirdAmount,
            'affivaditCMCurrency': obj.data.thirdCurrency,
            'affidavitCMInWords' : obj.data.thirdInwords,
            'affidavitCMType': obj.data.thirdundertakingTypeCoselect == undefined || obj.data.thirdundertakingTypeCoselect == "" ? "" : obj.data.thirdundertakingTypeCoselect.code,
            'affidavitCMDetail1': obj.data.thirdDetail1,
            'affidavitCMDetail2': obj.data.thirdDetail2,
            'promissoryAmount' : obj.data.fourthAmount,
            'promissoryCurrency' : obj.data.fourthCurrency,
            'promissoryInWords' : obj.data.fourthInwords,
            'promissoryDateOfLoan': obj.data.fourthpromissoryDateOfLoan.year + "-" + obj.data.fourthpromissoryDateOfLoan.month + "-" + obj.data.fourthpromissoryDateOfLoan.day,
            'promissoryLoanPeriod': obj.data.fourthpromissoryLoanPeriod.year + "-" + obj.data.fourthpromissoryLoanPeriod.month + "-" + obj.data.fourthpromissoryLoanPeriod.day,
            'promissoryLoanPurpose' : obj.data.fourthLoanPurpose,
            'promissoryInterestRate' : obj.data.fourthInterestRate,
            'promissoryScheme': obj.data.fourthpromissorySchemeSelected == undefined || obj.data.fourthpromissorySchemeSelected == "" ? "" : obj.data.fourthpromissorySchemeSelected.code,
            'promissoryPaymentTerm' : obj.data.fourthpromissoryPaymentTermSelected == undefined || obj.data.fourthpromissoryPaymentTermSelected == "" ? "" : obj.data.fourthpromissoryPaymentTermSelected.code,
            'createdDate': day,
            'updatedDate': day,
            'createdBy' : obj.data.createdBy,
            'updatedBy' : obj.data.createdBy,
            'username' : obj.data.username,
            'secondTabCheckbox' : obj.data.secondTabCheckbox,
            'thirdTabCheckbox' : obj.data.thirdTabCheckbox,
            'fourthTabCheckbox' : obj.data.fourthTabCheckbox
        }
        };
        return finalParams;
    }

    public viewLoanRequest(username: any) {
    
        let params = {
        TableName: this.loanTbl,
        IndexName: 'username-index',
        KeyConditionExpression: '#username =:username',
            ExpressionAttributeNames: {
                '#username' : 'username'
            },
            ExpressionAttributeValues: {
                ':username': username
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public viewLoanRequestById(loankey: any) {
    
        let params = {
        TableName: this.loanTbl,
        KeyConditionExpression: '#loankey =:loankey',
            ExpressionAttributeNames: {
                '#loankey' : 'loankey'
            },
            ExpressionAttributeValues: {
                ':loankey': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
    }
    
}

