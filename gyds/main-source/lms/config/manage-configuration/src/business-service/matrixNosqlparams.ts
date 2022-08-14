var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class MatrixNoSQLParams {

    public  tblNmL: string;
    public matrixTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getAllMatrix() {

        let params = {
        TableName: this.matrixTbl     
        }
     return params;
     
    }

    public insertMatrixTbl(bpcode: any, user: any, username: any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.matrixTbl,
        Item: {
            'bpcode' : bpcode,
            'processor' : user,
            'processorUsernm' : username,
            'approver' : "",
            'approverUsernm' : "",
            'reviewer' : "",
            'reviewerUsernm' : "",
            'thresholdAmount' : "",
            'createdBy' : user,
            'createdDate' : day,
            'updatedBy' : user,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateMatrixtbl(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.matrixTbl,
        Key: {
            bpcode: obj.data.bpcode
        },
        UpdateExpression: "set thresholdAmount = :thresholdAmount, processor = :processor, processorUsernm = :processorUsernm, reviewer = :reviewer, reviewerUsernm = :reviewerUsernm, approver = :approver, approverUsernm = :approverUsernm,updatedBy = :updatedBy,updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":thresholdAmount" : obj.data.thresholdAmount,
                ":processor" : obj.data.processor,
                ":processorUsernm" : obj.data.processorUsernm,
                ":reviewer" : obj.data.reviewer,
                ":reviewerUsernm" : obj.data.reviewerUsernm,
                ":approver" : obj.data.approver,
                ":approverUsernm" : obj.data.approverUsernm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public getMatrixByProcessor(processorUsername:any) {
    
        let params = {
        TableName: this.matrixTbl,
        IndexName: 'processorUsernm-index',
        KeyConditionExpression: '#processorUsernm =:processorUsernm',
            ExpressionAttributeNames: {
                '#processorUsernm' : 'processorUsernm'
            },
            ExpressionAttributeValues: {
                ':processorUsernm': processorUsername
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.matrixTbl = "gyds-lms-config-matrix-"+ process.env['environment_tag'];
    }
    
}

