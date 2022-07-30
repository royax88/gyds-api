var dateFormat = require('dateformat');

export class AddUserNoSQLParams {

    public userInfoTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getALlUser() {
    
        let params = {
        TableName: this.userInfoTbl     }
     return params;
    }

    public checkExistingUsername(username: any) {
    
        let params = {
        TableName: this.userInfoTbl,
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

    public insertIntoUserTable(obj:any)
    {
        console.log("obj", obj)
        let modVal = []
        modVal.push(obj.data.moduleNm)
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.userInfoTbl,
        Item: {
            'username' : obj.data.username,
            'password' : obj.data.password,
            'firstNm' : obj.data.firstnm,
            'lastNm' : obj.data.lastname,
            'middleNm' : obj.data.middlename,
            'module' : modVal,
            'status' : 'active',
            'systemRole': obj.data.userrole,
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'validFrom' : obj.data.validFrom,
            'validTo' : obj.data.validTo
        }
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.userInfoTbl = "gyds-user-info-" + process.env['environment_tag'];

    }
}

