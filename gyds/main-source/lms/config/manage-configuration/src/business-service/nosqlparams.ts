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
        IndexName: 'nameVal-index',
        KeyConditionExpression: '#nameVal =:nameVal',
            ExpressionAttributeNames: {
                '#nameVal' : 'nameVal'
            },
            ExpressionAttributeValues: {
                ':nameVal': name
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
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.countryCd,
            'valueVal' : obj.data.countryNm,
            'description' : obj.data.description,
            'detail1' : obj.data.isoNumber,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateCountryTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, detail1 = :detail1, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.countryNm,
                ":detail1" : obj.data.isoNumber,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertCollectionAgent(obj:any)
    {
        console.log("obj", obj)

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.collectionAgentCd,
            'valueVal' : obj.data.collectionAgentNm,
            'description' : "",
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateCollectionAgentTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.collectionAgentNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertCollectionGroup(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.collectionGroupCd,
            'valueVal' : obj.data.collectionGroupNm,
            'description' : "",
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateCollectionGroupTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.collectionGroupNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertCollateralType(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.collateralCd,
            'valueVal' : obj.data.collateralDescr,
            'description' : obj.data.collateralDescr,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateCollateralType(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.collateralDescr,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
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

