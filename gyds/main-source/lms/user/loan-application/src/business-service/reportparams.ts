

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
    // let params = {
    //     TableName: this.loanTbl,
    //     FilterExpression: "contains(#addtlCompany, :addtlCompany)",
    //     ExpressionAttributeNames: {
    //         "#addtlCompany": "addtlCompany",
    //     },
    //     ExpressionAttributeValues: {
    //         ":addtlCompany": company,
    //     }    
    //  }
     return params;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
    }
}