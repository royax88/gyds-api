

export class noSqlParams {

    public userInfoTbl: string;
    public lmsRole: string;
    constructor() {
        this.setNoSqlTables();
    }

    public checkUserLogin(username: any, password: any) {
    
        let params = {
        TableName: this.userInfoTbl,
        IndexName: 'username-password-index',
        KeyConditionExpression: '#username =:username and #password =:password',
            ExpressionAttributeNames: {
                '#username' : 'username',
                '#password' : 'password'
            },
            ExpressionAttributeValues: {
                ':username': username,
                ':password': password
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLMSrole(username: any) {
    
        let params = {
        TableName: this.lmsRole,
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


    private setNoSqlTables() {
      
        this.userInfoTbl = "gyds-user-info-" + process.env['environment_tag'];
        this.lmsRole = "gyds-lms-role-" + process.env['environment_tag'];
    }
}

