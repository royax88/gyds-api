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

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        console.log("code", obj.data.secondundertakingTypeselect.code)
        let finalParams: any = {
        TableName: this.loanTbl,
        Item: {
            'loankey' : uuidv4(),
            'status' : 'processed',
            'applicantLastNm': obj.data.firstAppLastName,
            'applicantFirstNm': obj.data.firstAppFirstName,
            'applicantMiddleNm': obj.data.firstAppMiddleName,
            'applicantCivilStatus': obj.data.firstAppCivilStatus,
            'comakerLastNm': obj.data.firstcoMakerAppLastName,
            'comakerFirstNm': obj.data.firstcoMakerFirstName,
            'comakerMiddleNm': obj.data.firstcoMakerMiddleName,
            'comakerCivilstatus': obj.data.firstcoMakerCivilStatus,
            'addtlCompany': obj.data.firstcompanySelect.code,
            'addtlCollectionAgent': obj.data.firstcollectionAgentSelect.code == undefined ? "" : obj.data.firstcollectionAgentSelect.code ,
            'applicationDate': obj.data.firstapplicationDate.year + "-" + obj.data.firstapplicationDate.month + "-" + obj.data.firstapplicationDate.day,
            'affidavitUTAmount' : obj.data.secondAmount,
            'affidavitUTCurrency': obj.data.secondCurrency,
            'affidavitUTInwords': obj.data.secondInwords,
            'affidavitUTType': obj.data.secondundertakingTypeselect.code == undefined ? "" : obj.data.secondundertakingTypeselect.code,
            'affidavitUTDetail1' : obj.data.secondDetail1,
            'affidavitUTDetail2' : obj.data.secondDetail2,
            'affidavitCMAmount' : obj.data.thirdAmount,
            'affivaditCMCurrency': obj.data.thirdCurrency,
            'affidavitCMInWords' : obj.data.thirdInwords,
            'affidavitCMType': obj.data.thirdundertakingTypeCoselect.code == undefined ? "" : obj.data.thirdundertakingTypeCoselect.code,
            'affidavitCMDetail1': obj.data.thirdDetail1,
            'affidavitCMDetail2': obj.data.thirdDetail2,
            'promissoryAmount' : obj.data.fourthAmount,
            'promissoryCurrency' : obj.data.fourthCurrency,
            'promissoryInWords' : obj.data.fourthInwords,
            'promissoryDateOfLoan': obj.data.fourthpromissoryDateOfLoan.year + "-" + obj.data.fourthpromissoryDateOfLoan.month + "-" + obj.data.fourthpromissoryDateOfLoan.day,
            'promissoryLoanPeriod': obj.data.fourthpromissoryLoanPeriod.year + "-" + obj.data.fourthpromissoryLoanPeriod.month + "-" + obj.data.fourthpromissoryLoanPeriod.day,
            'promissoryLoanPurpose' : obj.data.fourthLoanPurpose,
            'promissoryInterestRate' : obj.data.fourthInterestRate,
            'promissoryScheme': obj.data.fourthpromissorySchemeSelected.code == undefined ? "" : obj.data.fourthpromissorySchemeSelected.code,
            'promissoryPaymentTerm' : obj.data.fourthpromissoryPaymentTermSelected.code == undefined ? "" : obj.data.fourthpromissoryPaymentTermSelected.code,
            'createdDate': day,
            'updatedDate': day,
            'createdBy' : obj.data.createdBy,
            'updatedBy' : obj.data.createdBy
        }
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
    }
    
}

