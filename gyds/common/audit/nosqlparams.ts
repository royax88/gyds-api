
export class AuditNoSQLParams {

    public loanTbl: string;
    public  tblNmL: string;
    constructor() {
        this.setNoSqlTables();
    }


    public insertIntoAudit(loankey,status, action,createdBy,createdDate)
    {

        let finalParams: any = {
        TableName: this.loanTbl,
        Item: {
            'loankey' : loankey,
            'status' : status,
            'createdDate': createdDate,
            'createdBy': createdBy,
            'action' : action
        }
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-audit-" + process.env['environment_tag'];
    }
    
}

