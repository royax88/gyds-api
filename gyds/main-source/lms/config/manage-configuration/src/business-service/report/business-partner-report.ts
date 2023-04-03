import { Observable } from 'rxjs/Observable';
import {BusinessPartnerNoSQLParams} from '../businesspartnerNosqlparams';
import {ManageConfigDataService} from '../../data-service/manage-config-data-service';
var dateFormat = require('dateformat');

export class BusinessPartnerReportBusinessService {
    private noparams = new BusinessPartnerNoSQLParams();
    private manageConfigDataService = new ManageConfigDataService();
    constructor() {

    }

    public getBusinessPartnerReport(objData: any) : Observable<any> {
        let bpPartnerObj = [];
        var dateToday=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let allObj = [];
        let filterAppCode : any;
        let filterBpClass : any;
        let filterBpType: any;
        let filterBpRelationship: any;
        return Observable.create(async (observer) => {

            for(let comp in objData.data.company)
            {

                let companyParams = this.noparams.getBPByCompanyCode(objData.data.company[comp].code);
                await this.manageConfigDataService.executequeryDataServicePromise(companyParams).then(
                    (data) => {
                        if(data.Count >0)
                        {
                            for (let companyRes in data.Items)
                            {
                                bpPartnerObj.push(data.Items[companyRes])
                            }
                        }
                    }
                )
            }

            if(objData.data.applicantCode == "" && objData.data.bpClass == "" && objData.data.bpRelationshiop == "" && objData.data.bpType == "")
            {
                allObj = bpPartnerObj;
            }


            //filter applicant code
            if(objData.data.applicantCode != "")
            {
                console.log("with applicant")
                filterAppCode = this.filterApplicantCode(bpPartnerObj, objData.data);
                
                if(filterAppCode.length > 0)
                {
                    allObj = new Array();
                    allObj = filterAppCode;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }      
            }

            //filter bpClass
            if(objData.data.bpClass != "")
            {
                console.log("with bpClass")
                if(allObj.length > 0)
                {
                    filterBpClass = this.filterBPClass(allObj, objData.data);
                }
                else {
                    filterBpClass = this.filterBPClass(bpPartnerObj, objData.data);
                }   

                if(filterBpClass.length > 0)
                {
                    allObj = new Array();
                    allObj = filterBpClass;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }

            //filter bpType
            if(objData.data.bpType != "")
            {
                console.log("with bpType")
                if(allObj.length > 0)
                {
                    filterBpType = this.filterBPType(allObj, objData.data);
                }
                else {
                    filterBpType = this.filterBPType(bpPartnerObj, objData.data);
                }   

                if(filterBpType.length > 0)
                {
                    allObj = new Array();
                    allObj = filterBpType;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }

            //filter bp relationship
            if(objData.data.bpRelationshiop != "")
            {
                console.log("with bpType")
                if(allObj.length > 0)
                {
                    filterBpRelationship = this.filterBPRelationship(allObj, objData.data);
                }
                else {
                    filterBpRelationship = this.filterBPRelationship(bpPartnerObj, objData.data);
                }   

                if(filterBpRelationship.length > 0)
                {
                    allObj = new Array();
                    allObj = filterBpRelationship;
                }
                else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
                }          
  
            }
            
            allObj = allObj.filter((value, index, self) =>
                   index === self.findIndex((t) => (
                   t.bpCode === value.bpCode
              ))
            )

            if(allObj.length > 0)
            {
                let returnObj = [];
                for(let item in allObj)
                {
                    let newObj = {
                        company : allObj[item].bpCompanyNm,
                        applicantCode : allObj[item].bpCode,
                        applicantName : allObj[item].bpName,
                        civilStatus : allObj[item].bpCivilStatus,
                        bpClass : allObj[item].bpClassNm,
                        bpType : allObj[item].bpTypeNm,
                        bpRelationship : allObj[item].bpRelationshipNm,
                        bpTax : allObj[item].bpTaxRegistrationNo,
                        taxInfo : allObj[item].bpTaxInfo,
                        country : allObj[item].bpCountryNm,
                        province : allObj[item].bpProvinceNm,
                        city : allObj[item].bpCity,
                        postalCode : allObj[item].bpPostalCode,
                        addressDetail : allObj[item].bpAddressDetail,
                        bankInformation : "",
                        bankName : allObj[item].bpBankName,
                        bankBranch : allObj[item].bpBankBranch,
                        bankAccount : allObj[item].bpBanAccountNumber,
                        bankDetail : allObj[item].bpBankDetail
                    }
                    returnObj.push(newObj);
                }

                    let retval = {
                    report : returnObj,
                    title: "BP Account Details Report",
                    generatedDate: dateToday 
                }
                
                    observer.next(retval);
                    observer.complete();
            }
            else {
                    let retObject = []
                    observer.next(retObject);
                    observer.complete();
            }
            
        })

    }

    public filterApplicantCode(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.applicantCode)
                {
                    if(objdata[item].bpCode == UIobject.applicantCode[filter].value)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        
        return newObj;
     }

     public filterBPClass(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.bpClass)
                {
                    if(objdata[item].bpClassCd == UIobject.bpClass[filter].codeVal)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        
        return newObj;
     }

     public filterBPType(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.bpType)
                {
                    if(objdata[item].bpTypeCd == UIobject.bpType[filter].codeVal)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        
        return newObj;
     }

     public filterBPRelationship(objdata: any, UIobject: any) {
        let newObj = new Array;
            for(let item in objdata)
            {
                for(let filter in UIobject.bpRelationshiop)
                {
                    if(objdata[item].bpRelationshipCd == UIobject.bpRelationshiop[filter].codeVal)
                    {
                        newObj.push(objdata[item])
                    }
                }
            }
        
        return newObj;
     }
}