var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class DocumentNoSQLParams {

    public  tblNmL: string;
    public manageConfigTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public insertDocumentScheme(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.schemeCd,
            'valueVal' : "",
            'description' : obj.data.schemeDescr,
            'detail1' : obj.data.fyDependent,
            'detail2' : obj.data.numberingControl,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateDocumentScheme(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set description = :description, detail1 = :detail1,detail2 = :detail2, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":description" : obj.data.schemeDescr,
                ":detail1" : obj.data.fyDependent,
                ":detail2" : obj.data.numberingControl,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.manageConfigTbl = "gyds-lms-manage-config-"+ process.env['environment_tag'];
    }
    
}

