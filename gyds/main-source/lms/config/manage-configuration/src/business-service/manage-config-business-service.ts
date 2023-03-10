import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {ManageConfigNoSQLParams} from './nosqlparams';
import {ProvinceNoSQLParams} from './provinceNosqlparams';
import {CurrencyNoSQLParams} from './currencyNosqlparams';
import {CompanyNoSQLParams} from './companyNosqlparams';
import {BranchNoSQLParams} from './branchNosqlparams';
import {BusinessPartnerNoSQLParams} from './businesspartnerNosqlparams';
import {DocumentNoSQLParams} from './documentNosqlparams';
import {PaymentInterestNoSQLParams} from './paymentinterestNosqlparams';
import {FormNoSQLParams} from './formNmNosqlparams'
export class ManageConfigBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private manageConfigNoSQLParams = new ManageConfigNoSQLParams();
    private provinceNoSQLParams = new ProvinceNoSQLParams();
    private currencyNoSQLPrams = new CurrencyNoSQLParams();
    private companyParams = new CompanyNoSQLParams();
    private branchNoSQLParams = new BranchNoSQLParams();
    private bpNoSQLParams = new BusinessPartnerNoSQLParams();
    private docNoSqlParams = new DocumentNoSQLParams();
    private paymentParams = new PaymentInterestNoSQLParams();
    private formParams = new FormNoSQLParams();
    
    constructor() {

    }

    public getConfigValules(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfig(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {
                    let objData = []
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let newVal = {
                                code: data.Items[item].code,
                                value: data.Items[item].valueVal,
                            }
                            objData.push(newVal);
                        }
                    }
                   
                    observer.next(objData)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getAllData(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfig(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {             
                    observer.next(data)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getConfigByName(name: any) : Observable<any> {
       
        let queryParams = this.manageConfigNoSQLParams.getConfigByName(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    let objData = []
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            if(data.Items[item].statusVal=="active")
                            {
                                let newVal = {
                                    code: data.Items[item].codeVal,
                                    value: data.Items[item].valueVal,
                                    description: data.Items[item].description,
                                    detail1: data.Items[item].detail1
                                }
                                objData.push(newVal);
                            }
                        }
                    }
                   
                    observer.next(objData)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public insertConfig(obj: any,name: any) : Observable<any> {

        let queryParams = this.getParams(obj, name);
        console.log("")
        return Observable.create((observer) => {
            this.manageConfigDataService.InsertData(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "createdConfig"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public updateConfig(obj: any,name: any) : Observable<any> {

        let queryParams = this.getParams(obj, name);
        console.log("")
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updatedConfig"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getParams( obj: any, name: any)
    {
        let queryParams : any;
        if(name == "country")
        {
            queryParams = this.manageConfigNoSQLParams.insertCountryTbl(obj);
        }
        else if(name == "countryUpdate")
        {
            queryParams = this.manageConfigNoSQLParams.updateCountryTbl(obj);
        }

        else if(name == "province")
        {
            queryParams = this.provinceNoSQLParams.insertCountryTbl(obj);
        }

        else if(name == "provinceUpdate")
        {
            queryParams = this.provinceNoSQLParams.updateProvinceTbl(obj);
        }

        else if(name == "currency")
        {
            queryParams = this.currencyNoSQLPrams.insertCurrencyTbl(obj);
        }

        else if(name == "currencyUpdate")
        {
            queryParams = this.currencyNoSQLPrams.updateCurrencyTbl(obj);
        }

        else if(name == "company")
        {
            queryParams = this.companyParams.insertCompanyTbl(obj);
        }

        else if(name == "companyUpdate")
        {
            queryParams = this.companyParams.updateCompanyTbl(obj);
        }

        else if(name == "branch")
        {
            queryParams = this.branchNoSQLParams.insertBranchTbl(obj);
        }

        else if(name == "branchUpdate")
        {
            queryParams = this.branchNoSQLParams.updateBranchTbl(obj);
        }

        else if(name == "collectionagent")
        {
            queryParams = this.manageConfigNoSQLParams.insertCollectionAgent(obj);
        }

        else if(name == "collectionagentUpdate")
        {
            queryParams = this.manageConfigNoSQLParams.updateCollectionAgentTbl(obj);
        }

        else if(name == "collectiongroup")
        {
            queryParams = this.manageConfigNoSQLParams.insertCollectionGroup(obj);
        }

        else if(name == "collectiongroupUpdate")
        {
            queryParams = this.manageConfigNoSQLParams.updateCollectionGroupTbl(obj);
        }

        else if(name == "businesspartnerclass")
        {
            queryParams = this.bpNoSQLParams.insertBPclassTbl(obj);
        }

        else if(name == "businesspartnerclassUpdate")
        {
            queryParams = this.bpNoSQLParams.updateBPclassTbl(obj);
        }

        else if(name == "businesspartnertype")
        {
            queryParams = this.bpNoSQLParams.insertBPtypeTbl(obj);
        }

        else if(name == "businesspartnertypeUpdate")
        {
            queryParams = this.bpNoSQLParams.updateBPtypeTbl(obj);
        }

        else if(name == "businesspartnerrelationship")
        {
            queryParams = this.bpNoSQLParams.insertBPRelationshipTbl(obj);
        }

        else if(name == "businesspartnerrelationshipUpdate")
        {
            queryParams = this.bpNoSQLParams.updateBPRelationshipTbl(obj);
        }

        else if(name =="documentscheme")
        {
            queryParams = this.docNoSqlParams.insertDocumentScheme(obj);
        }

        else if(name =="Updatedocumentscheme")
        {
            queryParams = this.docNoSqlParams.updateDocumentScheme(obj);
        }

        else if(name =="documentrange")
        {
            queryParams = this.docNoSqlParams.insertDocumentRange(obj);
        }

        else if(name =="documentrangeupdate")
        {
            queryParams = this.docNoSqlParams.updateDocumentRange(obj);
        }

        else if(name =="paymentterms")
        {
            queryParams = this.paymentParams.insertConfigPayment(obj);
        } 

        else if(name =="paymenttermupdate")
        {
            queryParams = this.paymentParams.updateConfigPayment(obj);
        } 

        else if(name =="interestscheme")
        {
            queryParams = this.paymentParams.insertConfigInterest(obj);
        } 

        else if(name =="interestschemeupdate")
        {
            queryParams = this.paymentParams.updateConfigInterest(obj);
        } 

        else if(name =="typesofcollateral")
        {
            queryParams = this.manageConfigNoSQLParams.insertCollateralType(obj);
        } 

        else if(name =="collateralupdate")
        {
            queryParams = this.manageConfigNoSQLParams.updateCollateralType(obj);
        }
     
        return queryParams
    }

    public getAllConfigurationByName(name: any) : Observable<any> {

       
        let queryParams = this.manageConfigNoSQLParams.getConfigByName(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    observer.next(data)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getCodeValByName(name: any) : Observable<any> {

       
        let queryParams = this.manageConfigNoSQLParams.getConfigByName(name);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    let objData = [];
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            let newVal = {
                                id: data.Items[item].codeVal,
                                name: data.Items[item].codeVal,
                                main: data.Items[item].id
                            }
                            objData.push(newVal);
                        }
                    }
                    observer.next(objData)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public insertIntoFormTbl(obj: any) : Observable<any> {
        let queryParams = this.formParams.checkExistingRecord(obj.data.formId);
        return Observable.create((observer) => {
            this.manageConfigDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    console.log("data", data)
                    if(data.Count > 0)
                    {
                        let msg = {
                            message: "existingRecord"
                        }
                        observer.next(msg)
                        observer.complete();
                    }
                    else {
                        let insertParams = this.formParams.insertInfoFormTbl(obj);
                        console.log("insertParams", insertParams)

                        this.manageConfigDataService.InsertData(insertParams).subscribe(
                            (data) => {
                                
                                let msg = {
                                    message: "insertedForm"
                                }
                                observer.next(msg);
                                observer.complete();
                                
                            },
                            (error) => {
                                console.log("errr", error)
                                observer.error(error);
                            });
                    }
                    
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getAllFormData() : Observable<any> {
       
        let queryParams = this.formParams.getAllformIds();
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {             
                    observer.next(data)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public updateFormTbl(obj: any) : Observable<any> {

        let queryParams = this.formParams.updateDocumentRange(obj);
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updatedConfig"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public updateFormMatrixTbl(obj: any) : Observable<any> {
        
        let queryParams = this.formParams.updateApprovalMatrix(obj);
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updatedConfig"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

}