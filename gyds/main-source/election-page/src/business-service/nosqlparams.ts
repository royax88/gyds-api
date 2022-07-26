import logging = require('common-logging');
var dateFormat = require('dateformat');

export class EventDemandNoSQLParams {
    public electionMainTable: string;
    public electionResultTable: string;
    constructor() {
        this.setNoSqlTables();
    }

    public checkExistingRecord(id: string, email: string)
    {
        let finalParams: any = {
            TableName: this.electionMainTable,
            IndexName: 'id-email-index',
            KeyConditionExpression: '#id = :id and #email =:email',
                ExpressionAttributeNames: {
                    '#id': 'id',
                    '#email': 'email'
                },
                ExpressionAttributeValues: {
                    ':id': id,
                    ':email': email
                },
            ScanIndexForward: false //if value is true, sort ascending; false = descending
        };

        return finalParams;
    }

    public scanElectionResult()
    {
        let finalParams: any = {
            TableName: this.electionResultTable,
            ScanIndexForward: true 
        };

        return finalParams;
    }

    public insertIntoMainElection(id:any, email: any, obj: any)
    {
        
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.electionMainTable,
        Item: {
            'id' : id,
            'email' : email,
            'result' : obj.data
        }
        };
        return finalParams;
    }

    public getElected(id: any) {
    
        let params = {
        TableName: this.electionResultTable,
        KeyConditionExpression: '#id =:id',
            ExpressionAttributeNames: {
                '#id' : 'id'
            },
            ExpressionAttributeValues: {
                ':id': id
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public updateElectedRecord(id:any, countVal: Number)
    {
        
        let finalParams: any = {
            TableName: this.electionResultTable,
            Key: {
                "id" : id 
            },
            UpdateExpression: "set countVal = :countVal",
            ExpressionAttributeValues:{
                ":countVal" : countVal
            },
            ReturnValues:"UPDATED_NEW"
        };
        // console.log("final params", finalParams)
        return finalParams;
    }

    private setNoSqlTables() {
      
        this.electionMainTable = "ElectionMain-" + process.env['environment_tag'];
        this.electionResultTable = "ElectionResultTbl-" + process.env['environment_tag'];

    }
}

