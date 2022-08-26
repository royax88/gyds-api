var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';
import {v1 as uuid1} from 'uuid'

export class BusinessPartnerNoSQLParams {

    public  tblNmL: string;
    public manageConfigTbl: string;
    public businessPartnerTbl: string;
    constructor() {
        this.setNoSqlTables();
    }

    public insertBPclassTbl(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.bpClassCd,
            'valueVal' : obj.data.bpClassNm,
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

    public insertBPtypeTbl(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.bpTypeCd,
            'valueVal' : obj.data.bpTypeNm,
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

    public insertBPRelationshipTbl(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Item: {
            'id': uuidv4(),
            'nameVal' : obj.data.name,
            'codeVal' : obj.data.bpRelationshipCd,
            'valueVal' : obj.data.bpRelationshipNm,
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

    public updateBPclassTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.bpClassNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateBPtypeTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.bpTypeNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateBPRelationshipTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.manageConfigTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set valueVal = :valueVal, updatedBy = :updatedBy, updatedDate = :updatedDate, statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":valueVal" : obj.data.bpRelationshipNm,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }


    public insertIntoBusinessPartnerTbl(obj:any)
    {

        var CUSTOMEPOCH = 13000; // artificial epoch
        function generateRowId(shardId /* range 0-64 for shard/slot */) {
        var ts = new Date().getTime() - CUSTOMEPOCH; // limit to recent
        var randid = Math.floor(Math.random() * 64);
        ts = (ts * 4);   // bit-shift << 6
        ts = ts + shardId;
        return (ts * 64) + randid;
        }
        var newPrimaryHashKey = "bpcode-" + generateRowId(1);

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.businessPartnerTbl,
        Item: {
            'id': uuidv4(),
            'bpCode': obj.data.bpCode.toLowerCase(),
            'bpName' : obj.data.bpName,
            'bpCivilStatus' : obj.data.bpCivilStatus,
            'bpCompanyCd' : obj.data.bpCompany  == "" ? "" : obj.data.bpCompany.code,
            'bpCompanyNm' : obj.data.bpCompany  == "" ? "" : obj.data.bpCompany.companyName,
            'bpClassCd' : obj.data.bpClass == "" ? "" : obj.data.bpClass.code,
            'bpClassNm' : obj.data.bpClass == "" ? "" : obj.data.bpClass.value,
            'bpTypeCd' : obj.data.bpType == "" ? "" : obj.data.bpType.code,
            'bpTypeNm' : obj.data.bpType == "" ? "" : obj.data.bpType.value,
            'bpRelationshipCd' : obj.data.bpRelationship == "" ? "" : obj.data.bpRelationship.code,
            'bpRelationshipNm' : obj.data.bpRelationship == "" ? "" : obj.data.bpRelationship.value,
            'bpTaxRegistrationNo' : obj.data.bpTaxRegistrationNo,
            'bpTaxInfo' : obj.data.bpTaxInfo,
            'bpCountryCd' : obj.data.bpCountry == "" ? "" : obj.data.bpCountry.code,
            'bpCountryNm' : obj.data.bpCountry == "" ? "" : obj.data.bpCountry.value,
            'bpProvinceCd' : obj.data.bpProvince  == "" ? "" : obj.data.bpProvince.code,
            'bpProvinceNm' : obj.data.bpProvince  == "" ? "" : obj.data.bpProvince.value,
            'bpCity' : obj.data.bpCity,
            'bpPostalCode' : obj.data.bpPostalCode,
            'bpAddressDetail' : obj.data.bpAddressDetail,
            'bpBankName' : obj.data.bpBankName,
            'bpBankBranch' : obj.data.bpBankBranch,
            'bpBanAccountNumber' : obj.data.bpBanAccountNumber,
            'bpBankDetail' : obj.data.bpBankDetail,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateIntoBusinessPartnerTbl(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.businessPartnerTbl,
        Key: {
            id: obj.data.id
        },
        UpdateExpression: "set bpName = :bpName, bpCivilStatus = :bpCivilStatus, bpCompanyCd = :bpCompanyCd, bpCompanyNm = :bpCompanyNm , bpClassCd = :bpClassCd, bpClassNm = :bpClassNm , bpTypeCd = :bpTypeCd , bpTypeNm = :bpTypeNm," + 
                          "bpRelationshipCd = :bpRelationshipCd, bpRelationshipNm = :bpRelationshipNm, bpTaxRegistrationNo = :bpTaxRegistrationNo, bpTaxInfo = :bpTaxInfo, bpCountryCd = :bpCountryCd, bpCountryNm = :bpCountryNm," +
                          "bpProvinceCd = :bpProvinceCd, bpProvinceNm = :bpProvinceNm, bpCity = :bpCity, bpPostalCode = :bpPostalCode, bpAddressDetail = :bpAddressDetail, bpBankName = :bpBankName, bpBankBranch = :bpBankBranch, bpBanAccountNumber = :bpBanAccountNumber, bpBankDetail = :bpBankDetail,updatedBy = :updatedBy,updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":bpName" : obj.data.bpName,
                ":bpCivilStatus" : obj.data.bpCivilStatus,
                ":bpCompanyCd" : obj.data.bpCompanyCd == undefined ? "" : obj.data.bpCompanyCd,
                ":bpCompanyNm" : obj.data.bpCompanyNm == undefined ? "" : obj.data.bpCompanyNm,
                ":bpClassCd" : obj.data.bpClassCd == undefined ? "" : obj.data.bpClassCd,
                ":bpClassNm" : obj.data.bpClassNm == undefined ? "" : obj.data.bpClassNm,
                ":bpTypeCd" : obj.data.bpTypeCd == undefined ? "" : obj.data.bpTypeCd,
                ":bpTypeNm" : obj.data.bpTypeNm == undefined ? "" : obj.data.bpTypeNm,
                ":bpRelationshipCd" : obj.data.bpRelationshipCd == undefined ? "" : obj.data.bpRelationshipCd,
                ":bpRelationshipNm" : obj.data.bpRelationshipNm == undefined ? "" : obj.data.bpRelationshipNm,
                ":bpTaxRegistrationNo" : obj.data.bpTaxRegistrationNo,
                ":bpTaxInfo" : obj.data.bpTaxInfo,
                ":bpCountryCd" : obj.data.bpCountryCd == undefined ? "" : obj.data.bpCountryCd,
                ":bpCountryNm" : obj.data.bpCountryNm == undefined ? "" : obj.data.bpCountryNm,
                ":bpProvinceCd" : obj.data.bpProvinceCd == undefined ? "" : obj.data.bpProvinceCd,
                ":bpProvinceNm" : obj.data.bpProvinceNm == undefined ? "" : obj.data.bpProvinceNm,
                ":bpCity" : obj.data.bpCity,
                ":bpPostalCode" : obj.data.bpPostalCode,
                ":bpAddressDetail" : obj.data.bpAddressDetail,
                ":bpBankName" : obj.data.bpBankName,
                ":bpBankBranch" : obj.data.bpBankBranch,
                ":bpBanAccountNumber" : obj.data.bpBanAccountNumber,
                ":bpBankDetail" : obj.data.bpBankDetail,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public getAllBusinessPartner() {

        let params = {
        TableName: this.businessPartnerTbl     
        }

     return params;
     
    }

    public checkExistingCode(bpcode:any) {
    
        let params = {
        TableName: this.businessPartnerTbl,
        IndexName: 'bpCode-index',
        KeyConditionExpression: '#bpCode =:bpCode',
            ExpressionAttributeNames: {
                '#bpCode' : 'bpCode'
            },
            ExpressionAttributeValues: {
                ':bpCode': bpcode
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.manageConfigTbl = "gyds-lms-manage-config-"+ process.env['environment_tag'];
        this.businessPartnerTbl = "gyds-lms-business-partner-"+ process.env['environment_tag'];
    }
    
}

