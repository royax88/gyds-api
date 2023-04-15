

export class LoanReportNoSQLParams { 

    public loanTbl: string;

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

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
    }
}