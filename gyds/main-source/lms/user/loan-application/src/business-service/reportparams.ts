import {v4 as uuidv4} from 'uuid';
var dateFormat = require('dateformat');

export class LoanReportNoSQLParams { 

    public loanTbl: string;
    public loanChargeTbl: string; 
    public loanReceivable: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getLoanAppByCompany(company: any) {
        let params = {
        TableName: this.loanTbl,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanChargeReport(company: any) {
        let params = {
        TableName: this.loanChargeTbl,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanReceivableReport(company: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLastLoanReceiveData(loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'isLastIndicator-loankey-index',
        KeyConditionExpression: '#isLastIndicator =:isLastIndicator and #loankey =:loankey',
            ExpressionAttributeNames: {
                '#isLastIndicator' : 'isLastIndicator',
                '#loankey' : 'loankey'
            },
            ExpressionAttributeValues: {
                ':isLastIndicator': "1",
                ':loankey': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getAllLoanReceiveDataByLoanKey(loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'loankey-index',
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

    public getLoanAppByCompanyByStatus(company: any) {
        let params = {
        TableName: this.loanTbl,
        IndexName: 'addtlCompany-statusVal-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany and #statusVal =:statusVal',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany',
                '#statusVal' : 'statusVal'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company,
                ':statusVal': "Released"
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public insertIntoReceivableReportTbl(obj:any)
    {
        let overYearInd : any = "0";
        if(obj.remarks== "Interest Receivable" && obj.overYearIndForInterestReceivable == true)
        {
            overYearInd = "1";
        }
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.loanReceivable,
        Item: {
            'id' : uuidv4(),
            'loankey' : obj.loankey,
            'addtlCompany': obj.companyCode,
            'addtlCompanyValue': obj.company,
            'applicantFirstNm': obj.applicantCode,
            'applicantLastNm': obj.applicantName,
            'comakerFirstNm': obj.coMakerCode,
            'comakerLastNm': obj.coMakerName,
            'applicationDate': obj.applicationDate,
            'LRloanReleaseDt': obj.releaseDate,
            'docNumber': obj.loanForm,
            'updatedBy': obj.releasedBy,
            'addtlCollectionGroup': obj.addtlCollectionGroup,
            'addtlCollectionGroupValue': obj.addtlCollectionGroupValue,
            'addtlCollectionAgent': obj.addtlCollectionAgent,
            'addtlCollectionAgentValue': obj.addtlCollectionAgentValue,
            'amountVal': obj.calculatedInterest,
            'remarksVal': obj.remarks,
            'promissoryInterestRate': obj.interestRate,
            'promissoryScheme': obj.interestSchemeCode,
            'promissorySchemeValue': obj.interestScheme,
            'promissoryPaymentTerm': obj.paymentTermCode,
            'promissoryPaymentTermValue': obj.paymentTerm,
            'createdDate': day,
            'isLastIndicator': '1',
            'isOneYearIndicator': overYearInd,
            'promissoryCurrency' : obj.promissoryCurrency,
            'calculatedInterest': obj.calculatedInterest,
            'interestCalculationDate': obj.interestCalculationDate,
            'interestDueDate': obj.interestDueDate
        }
        };
        return finalParams;
    }

    public updateLastIndicator(id)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanReceivable,
        Key: {
            id: id
        },
        UpdateExpression: "set isLastIndicator = :isLastIndicator, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":isLastIndicator" : "0",
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateLoanWithInterestReceivable(loankey)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanTbl,
        Key: {
            loankey: loankey
        },
        UpdateExpression: "set isInterestReceivable = :isInterestReceivable",
            ExpressionAttributeValues:{
                ":isInterestReceivable" : "true"
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
        this.loanChargeTbl = "gyds-lms-loan-charge-report-" + process.env['environment_tag'];
        this.loanReceivable = "gyds-lms-loan-receivable-report-" + process.env['environment_tag'];
    }
}