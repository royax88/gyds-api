var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class PaymentInterestNoSQLParams {

    public tblNmL: string;
    public configTbl: string;

    constructor() {
        this.setNoSqlTables();
    }


    public insertConfigPayment(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.configTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.paymentTermCd,
            'valueVal' : "",
            'description' : obj.data.paymentTermDescr,
            'detail1' : obj.data.term,
            'detail2' : obj.data.termValue,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateConfigPayment(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.configTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set description = :description, detail1 = :detail1,detail2 = :detail2, updatedBy = :updatedBy, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":description" : obj.data.paymentTermDescr,
                ":detail1" : obj.data.term,
                ":detail2" : obj.data.termVal,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertConfigInterest(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.configTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.interestSchemeCd,
            'valueVal' : "",
            'description' : obj.data.interestSchemeDescr,
            'detail1' : obj.data.frequency,
            'detail2' : obj.data.allowGracePeriod,
            'detail3' : obj.data.allowProCalculation,
            'detail4' : obj.data.accrueReverse,
            'detail5' : obj.data.periodDetermination,
            'detail6' : obj.data.noOfDaysPeriod,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateConfigInterest(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.configTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set description = :description, detail1 = :detail1,detail2 = :detail2,detail3 = :detail3,detail4 = :detail4,detail5 = :detail5,detail6 = :detail6, updatedBy = :updatedBy, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":description" : obj.data.interestSchemeDescr,
                ":detail1" : obj.data.frequency,
                ":detail2" : obj.data.allowGracePeriod,
                ":detail3" : obj.data.allowProCalculation,
                ":detail4" : obj.data.accrueReverse,
                ":detail5" : obj.data.periodDetermination,
                ":detail6" : obj.data.noOfDaysPeriod,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.configTbl = "gyds-lms-manage-config-"+ process.env['environment_tag'];
    }
    
    
}

