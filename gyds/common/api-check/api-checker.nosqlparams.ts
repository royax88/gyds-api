
export class APICheckNoSqlParams {

    public userTbl: string;
    public matrixTbl: string;
    constructor() {
        this.setNoSqlTables();
    }


    private setNoSqlTables() {

        this.userTbl = "gyds-user-info-" + process.env['environment_tag'];
        this.matrixTbl = "gyds-lms-config-matrix-" + process.env['environment_tag'];
    }
    
}

