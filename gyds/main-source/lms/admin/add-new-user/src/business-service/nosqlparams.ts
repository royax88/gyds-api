var dateFormat = require('dateformat');

export class AddUserNoSQLParams {

    public userInfoTbl: string;
    public userRoleTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getALlUser() {
    
        let params = {
        TableName: this.userInfoTbl     }
     return params;
    }

    public getAllLMSRole() {
    
        let params = {
        TableName: this.userRoleTbl     }
     return params;
    }


    public getALlUserByModule(moduleNm:any) {
    
        let params = {
        TableName: this.userInfoTbl,
        FilterExpression: "contains(#module, :module)",
        ExpressionAttributeNames: {
            "#module": "module",
        },
        ExpressionAttributeValues: {
            ":module": moduleNm,
        }    
     }
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

    public getUserRole(username: any) {
    
        let params = {
        TableName: this.userRoleTbl,
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

    public updateLMSRole(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.userRoleTbl,
        Key: {
            username: obj.data.username
        },
        UpdateExpression: "set lmsrole = :lmsrole, updatedBy = :updatedBy, updatedDate = :updatedDate, lmsroleNm = :lmsroleNm",
            ExpressionAttributeValues:{
                ":lmsrole" : obj.data.lmsrole,
                ":lmsroleNm" : obj.data.roleNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertIntoUserRoleTbl(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.userRoleTbl,
        Item: {
            'username' : obj.data.username,
            'fullNm' : obj.data.fullNm,
            'lmsrole' : obj.data.lmsrole,
            'lmsroleNm': obj.data.roleNm,
            'createdBy' : obj.data.user,
            'createdDate' : day,
            'updatedBy' : obj.data.user,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.userInfoTbl = "gyds-user-info-" + process.env['environment_tag'];
        this.userRoleTbl = "gyds-lms-role-" + process.env['environment_tag'];

    }
}

