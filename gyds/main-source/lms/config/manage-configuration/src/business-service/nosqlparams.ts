var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class ManageConfigNoSQLParams {

    public manageCompany: string;
    public  tblNmL: string;
    public collectionGroup: string;
    public collectionAgent: string;
    public configurationTbl: string;
    public manageConfigTbl: string;

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
        TableName: this.manageConfigTbl,
        IndexName: 'name-index',
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

    public insertCountryTbl(obj:any)
    {
        console.log("obj", obj)

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'name' : obj.data.name,
            'code' : obj.data.countryCd,
            'value' : obj.data.countryNm,
            'description' : obj.data.description,
            'detail1' : obj.data.isoNumber,
            'status' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.manageCompany = "gyds-lms-config-company-" + process.env['environment_tag'];
        this.collectionGroup = "gyds-lms-config-collection-group-" + process.env['environment_tag'];
        this.collectionAgent = "gyds-lms-config-collection-agent-" + process.env['environment_tag'];
        this.configurationTbl = "gyds-lms-configuration-"+ process.env['environment_tag'];
        this.manageConfigTbl = "gyds-lms-manage-config-"+ process.env['environment_tag'];
    }
    
}

