var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class FormNoSQLParams {

    public  tblNmL: string;
    public formTbl: string;
    public formListTbl: string;
    public numberRangeTbl: string;
    constructor() {
        this.setNoSqlTables();
    }

    public insertInfoFormTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.formTbl,
        Item: {
            'primaryid':  obj.data.formId,
            'formid' : uuidv4(),
            'formname' : obj.data.formNm,
            'statusVal' : '',
            'detail1' : '',
            'detail2' : '',
            'detail3' : '',
            'detail4' : '',
            'detail5' : '',
            'detail6' : 'temp',
            'detail7' : '',
            'detail8' : '',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public insertInfoFormListTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.formListTbl,
        Item: {
            'formid' : obj.data.formId,
            'formname' : obj.data.formNm,
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public insertIntoNumberRangeTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.numberRangeTbl,
        Item: {
            'formid' : obj.data.id,
            'detail1' : obj.data.fyStart.year + "-" + obj.data.fyStart.month + "-" + obj.data.fyStart.day,
            'detail2' : obj.data.NoSchemeCode,
            'detail3' : obj.data.fromNumberRange,
            'detail4' : obj.data.toNumberRange,
            'createdBy' : obj.data.user,
            'createdDate' : day
        }
        };
        return finalParams;
    }

    public checkExistingRecord(formid: any)
    {
        let params = {
            TableName: this.formListTbl,
            KeyConditionExpression: '#formid =:formid',
                ExpressionAttributeNames: {
                    '#formid' : 'formid'
                },
                ExpressionAttributeValues: {
                    ':formid': formid
                },
            ScanIndexForward: false 
         }
         return params;
    }

    public getDocumentRangeById(formid: any)
    {
        let params = {
            TableName: this.numberRangeTbl,
            KeyConditionExpression: '#formid =:formid',
                ExpressionAttributeNames: {
                    '#formid' : 'formid'
                },
                ExpressionAttributeValues: {
                    ':formid': formid
                },
            ScanIndexForward: false 
         }
         return params;
    }

    public getAllformIds()
    {
        let params = {
            TableName: this.formTbl
         }
         return params;
    }

    public getAllformListIds()
    {
        let params = {
            TableName: this.formListTbl
         }
         return params;
    }

    public getAllNumberRangeTbl()
    {
        let params = {
            TableName: this.numberRangeTbl
         }
         return params;
    }



    public updateDocumentRange(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.formTbl,
        Key: {
            formid: obj.data.id
        },
        UpdateExpression: "set detail1 = :detail1, detail2 = :detail2,detail3 = :detail3,detail4 = :detail4, updatedBy = :updatedBy, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":detail1" : obj.data.fyStart.year + "-" + obj.data.fyStart.month + "-" + obj.data.fyStart.day,
                ":detail2" : obj.data.NoSchemeCode,
                ":detail3" : obj.data.fromNumberRange,
                ":detail4" : obj.data.toNumberRange,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateApprovalMatrix(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.formTbl,
        Key: {
            formid: obj.data.id
        },
        UpdateExpression: "set detail5 = :detail5, detail6 = :detail6,detail7 = :detail7,detail8 = :detail8, updatedBy = :updatedBy, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":detail5" : obj.data.thresholdAmount,
                ":detail6" : obj.data.processor,
                ":detail7" : obj.data.reviewer,
                ":detail8" : obj.data.approver,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertApprovalMatrix(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.formTbl,
        Item: {
            'formid' : uuidv4(),
            'formidval' : obj.data.id,
            'detail5' : obj.data.thresholdAmount,
            'detail6' : obj.data.processor,
            'detail7' : obj.data.reviewer,
            'detail8' : obj.data.approver,
            'detail9' : obj.data.currency,
            'createdBy' : obj.data.user,
            'createdDate' : day
        }
        };
        return finalParams;
    }

    public getFormProcessor(val: any) {
    
        let params = {
        TableName: this.formTbl,
        IndexName: 'detail6-index',
        KeyConditionExpression: '#detail6 =:detail6',
            ExpressionAttributeNames: {
                '#detail6' : 'detail6'
               
            },
            ExpressionAttributeValues: {
                ':detail6': val
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.formTbl = "gyds-lms-config-form-"+ process.env['environment_tag'];
        this.formListTbl = "gyds-lms-config-form-list-"+ process.env['environment_tag'];
        this.numberRangeTbl = "gyds-lms-config-number-range-" + process.env['environment_tag'];
    }
    
}

