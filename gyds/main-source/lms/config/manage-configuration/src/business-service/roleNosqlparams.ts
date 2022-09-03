var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class RoleNoSQLParams {

    public  tblNmL: string;
    public roleTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getAllRole() {

        let params = {
        TableName: this.roleTbl     
        }
     return params;
     
    }

    public insertIntoRoleTbl(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.roleTbl,
        Item: {
            'roleCd' : obj.data.roleCd.toLowerCase(),
            'roleNm' : obj.data.roleNm.toLowerCase(),
            'roleAccess' : obj.data.roleAccess,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public checkExistingRoleCd(roleCd:any) {
    
        let params = {
        TableName: this.roleTbl,
        KeyConditionExpression: '#roleCd =:roleCd',
            ExpressionAttributeNames: {
                '#roleCd' : 'roleCd'
            },
            ExpressionAttributeValues: {
                ':roleCd': roleCd
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public checkExistingRoleNm(roleNm:any) {
    
        let params = {
        TableName: this.roleTbl,
        IndexName: 'roleNm-index',
        KeyConditionExpression: '#roleNm =:roleNm',
            ExpressionAttributeNames: {
                '#roleNm' : 'roleNm'
            },
            ExpressionAttributeValues: {
                ':roleNm': roleNm
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getRoleMatrix(roleAccess: any, roleNm:any) {
    
        let params = {
        TableName: this.roleTbl,
        IndexName: 'roleAccess-roleNm-index',
        KeyConditionExpression: '#roleAccess =:roleAccess and #roleNm =:roleNm',
            ExpressionAttributeNames: {
                '#roleAccess' : 'roleAccess',
                '#roleNm' : 'roleNm'
            },
            ExpressionAttributeValues: {
                ':roleAccess': roleAccess,
                ':roleNm': roleNm
            },
        ScanIndexForward: false 
     }
     return params;
    }


    private setNoSqlTables() {

        this.roleTbl = "gyds-lms-config-role-"+ process.env['environment_tag'];
    }
    
}

