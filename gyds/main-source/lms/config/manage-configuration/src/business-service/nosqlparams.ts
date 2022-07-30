var dateFormat = require('dateformat');

export class ManageConfigNoSQLParams {

    public manageCompany: string;
    public  tblNmL: string;
    public collectionGroup: string;
    public collectionAgent: string;
    public configurationTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getConfig(name:any) {
        if(name == "company")
        {
            this.tblNmL = this.manageCompany;
        }
        else if(name=="collectionGroup")
        {
            this.tblNmL = this.collectionGroup;
        }  
        else if(name=="collectionAgent")
        {
            this.tblNmL = this.collectionAgent;
        }   

        let params = {
        TableName: this.tblNmL     
        }
     return params;
     
    }

    public getConfigByName(name:any) {
    
        let params = {
        TableName: this.configurationTbl,
        KeyConditionExpression: '#name =:name',
            ExpressionAttributeNames: {
                '#name' : 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            },
        ScanIndexForward: false 
     }
     return params;
    }

    // public insertIntoUserTable(obj:any)
    // {
    //     console.log("obj", obj)
    //     let modVal = []
    //     modVal.push(obj.data.moduleNm)
    //     var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    //     let finalParams: any = {
    //     TableName: this.userInfoTbl,
    //     Item: {
    //         'username' : obj.data.username,
    //         'password' : obj.data.password,
    //         'firstNm' : obj.data.firstnm,
    //         'lastNm' : obj.data.lastname,
    //         'middleNm' : obj.data.middlename,
    //         'module' : modVal,
    //         'status' : 'active',
    //         'systemRole': obj.data.userrole,
    //         'createdBy' : obj.data.createdBy,
    //         'createdDate' : day,
    //         'validFrom' : obj.data.validFrom,
    //         'validTo' : obj.data.validTo
    //     }
    //     };
    //     return finalParams;
    // }

    private setNoSqlTables() {

        this.manageCompany = "gyds-lms-config-company-" + process.env['environment_tag'];
        this.collectionGroup = "gyds-lms-config-collection-group-" + process.env['environment_tag'];
        this.collectionAgent = "gyds-lms-config-collection-agent-" + process.env['environment_tag'];
        this.configurationTbl = "gyds-lms-configuration-"+ process.env['environment_tag'];
    }
    
}

