var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class ManageConfigNoSQLParams {

    public manageCompany: string;
    public  tblNmL: string;
    public collectionGroup: string;
    public collectionAgent: string;
    public configurationTbl: string;
    public manageConfigTbl: string;
    public interestCalc: string;
    public paymentConfig: string;

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

    public getInterestCalculationTbl() {
    
        let params = {
        TableName: this.interestCalc
     }
     return params;
    }

    public getPaymentConfigTbl() {
    
        let params = {
        TableName: this.paymentConfig
     }
     return params;
    }

    public updateInterestCalculationTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.interestCalc,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set addDeductAction = :addDeductAction, interestCalculation = :interestCalculation, updatedDate = :updatedDate, updatedBy = :updatedBy, reportOutput = :reportOutput",
            ExpressionAttributeValues:{
                ":addDeductAction" : obj.data.addDeductAction,
                ":interestCalculation" : obj.data.interestCalculation,
                ":updatedDate" : day,
                ":updatedBy" : obj.data.user,
                ":reportOutput" : obj.data.reportOutput,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertIntoPaymentConfigTbl(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.paymentConfig,
        Item: {
            'id': obj.data.company.code,
            'companyCd' : obj.data.company.code,
            'companyVal' : obj.data.company.value,
            'transactionCd' : obj.data.transaction.code,
            'transactionVal' : obj.data.transaction.value,
            'fyStartVal' : obj.data.fystart.year + "-" + obj.data.fystart.month + "-" + obj.data.fystart.day,
            'noSchemeCd' : obj.data.noschemecode.codeVal,
            'noSchemeVal' : obj.data.noschemecode.description,
            'rangeFrom' : obj.data.rangefrom,
            'rangeTo' : obj.data.rangeTo,
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
        this.interestCalc = "gyds-lms-config-interest-calculation-" + process.env['environment_tag'];
        this.paymentConfig = "gyds-lms-config-payment-" + process.env['environment_tag'];
    }
    
}

