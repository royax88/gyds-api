var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class LoanReportParams {
    public tblNmL: string;

    constructor()
    {
        this.setNoSqlTables();
    }

    public getLoanReportFields(reportNm: any) {
    
        let params = {
        TableName: this.tblNmL,
        IndexName: 'moduleValue-index',
        KeyConditionExpression: '#moduleValue =:moduleValue',
            ExpressionAttributeNames: {
                '#moduleValue' : 'moduleValue'
            },
            ExpressionAttributeValues: {
                ':moduleValue': reportNm
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.tblNmL = "gyds-lms-config-loan-report-"+ process.env['environment_tag'];
    }

}
