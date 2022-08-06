var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class CompanyNoSQLParams {

    public  tblNmL: string;
    public companyTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public insertCompanyTbl(obj:any)
    {

        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.companyTbl,
        Item: {
            'nameVal' : obj.data.name,
            'code' : obj.data.companyCd,
            'valueVal' : obj.data.companyNm,
            'registrationNo' : obj.data.CORegistrationNo,
            'currencyCd' : obj.data.currency.code,
            'currencyVal' : obj.data.currency.value,
            'taxinfo1' : obj.data.taxinfo1,
            'taxinfo2' : obj.data.taxinfo2,
            'taxinfo3' : obj.data.taxinfo3,
            'countryCd' : obj.data.country.code,
            'countryVal' : obj.data.country.value,
            'provinceCd' : obj.data.province.code,
            'provinceVal' : obj.data.province.value,
            'cityVal' : obj.data.city,
            'postalCdVal' : obj.data.postalCode,
            'addressDetail1' : obj.data.addressdetail1,
            'addressDetail2' : obj.data.addressdetail2,
            'addressDetail3' : obj.data.addressdetail3,
            'statusVal' : 'active',
            'createdBy' : obj.data.createdBy,
            'createdDate' : day,
            'updatedBy' : obj.data.createdBy,
            'updatedDate' : day,
        }
        };
        return finalParams;
    }

    public updateCompanyTbl(obj:any)
    {
        var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        let finalParams: any = {
        TableName: this.companyTbl,
        Key: {
            code: obj.data.code
        },
        UpdateExpression: "set companyName = :companyName, registrationNo = :registrationNo,currencyCd = :currencyCd, currencyVal = :currencyVal, taxinfo1 = :taxinfo1, taxinfo2 = :taxinfo2, taxinfo3 = :taxinfo3, countryCd = :countryCd, countryVal = :countryVal, provinceCd = :provinceCd, provinceVal = :provinceVal, addressDetail1 = :addressDetail1, addressDetail2 = :addressDetail2, addressDetail3 = :addressDetail3, updatedBy = :updatedBy , updatedDate = :updatedDate,statusVal = :statusVal",
            ExpressionAttributeValues:{
                ":companyName" : obj.data.companyName,
                ":registrationNo" : obj.data.registrationNo,
                ":currencyCd" : obj.data.currencyCd,
                ":currencyVal" : obj.data.currencyVal,
                ":taxinfo1" : obj.data.taxinfo1,
                ":taxinfo2" : obj.data.taxinfo2,
                ":taxinfo3" : obj.data.taxinfo3,
                ":countryCd" : obj.data.countryCd,
                ":countryVal" : obj.data.countryVal,
                ":provinceCd" : obj.data.provinceCd,
                ":provinceVal" : obj.data.provinceVal,
                ":addressDetail1" : obj.data.addressDetail1,
                ":addressDetail2" : obj.data.addressDetail2,
                ":addressDetail3" : obj.data.addressDetail3,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":statusVal" : obj.data.status,
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.companyTbl = "gyds-lms-config-company-"+ process.env['environment_tag'];
    }
    
}

