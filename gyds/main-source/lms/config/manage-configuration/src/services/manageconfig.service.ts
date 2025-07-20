import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { ManageConfigBusinessService} from '../business-service/manage-config-business-service';
import {BusinssPartnerBusinessService} from '../business-service/businesspartner.service';
import {ApprovalMatrixPartnerBusinessService} from '../business-service/approvalmatrix.service';
import {RoleBusinessService} from '../business-service/role.service';
import {BusinessPartnerReportBusinessService} from '../business-service/report/business-partner-report';
export class ManageConfigService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
    private manageConfigBusinessService = new ManageConfigBusinessService();
    private businssPartnerBusinessService= new BusinssPartnerBusinessService();
    private approvalMatrixBusinessService = new ApprovalMatrixPartnerBusinessService();
    private roleBusinessService = new RoleBusinessService();
    private bpReport = new BusinessPartnerReportBusinessService();
    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        
        // Validate event and body
        if (!event || !event.body) {
            return Observable.create((observer) => {
                observer.error({
                    message: "Invalid event or missing body",
                    statusCode: 400
                });
            });
        }

        try {
            // Always parse the JSON body since event.body is always a string
            const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
            this.actioncd = body.actioncd;
            this.objData = body;
        } catch (error) {
            return Observable.create((observer) => {
                observer.error({
                    message: "Invalid JSON in request body",
                    statusCode: 400
                });
            });
        }

        if(this.actioncd=='getConfig')
        {
            this.name = this.objData.name;
            return this.manageConfigBusinessService.getConfigValules(this.name);
        }
        else if(this.actioncd=='getConfigByName')
        {
            this.name = this.objData.name;
            return this.manageConfigBusinessService.getConfigByName(this.name);
        }
        else if(this.actioncd=='insertIntoConfigTbl')
        {
            // Extract name from nested data structure if available, fallback to direct access
            const configName = this.objData.data?.name || this.objData.name;
            return this.manageConfigBusinessService.insertConfig(this.objData, configName);
        }
        else if(this.actioncd=='updateConfigTbl')
        {
            // Extract name from nested data structure if available, fallback to direct access
            const configName = this.objData.data?.name || this.objData.name;
            return this.manageConfigBusinessService.updateConfig(this.objData, configName);
        }
        else if(this.actioncd=='getAllConfigurationByName')
        {
            this.name = this.objData.name;
            return this.manageConfigBusinessService.getAllConfigurationByName(this.name);
        }

        else if(this.actioncd=='getAllDataViaScan')
        {
            this.name = this.objData.name;
            return this.manageConfigBusinessService.getAllData(this.name);
        }
        else if(this.actioncd=='insertIntoBusinessPartner')
        {
            return this.businssPartnerBusinessService.insertBusinessPartner(this.objData);
        }
        else if(this.actioncd=='updateIntoBusinessPartner')
        {
            return this.businssPartnerBusinessService.updateBusinessPartner(this.objData);
        }

        else if(this.actioncd=='getAllBusinessPartner')
        {
            return this.businssPartnerBusinessService.getAllBusinessPartner();
        }

        else if(this.actioncd=='getBPCodes')
        {
            return this.businssPartnerBusinessService.getBPCodes();
        }

        else if(this.actioncd =="getAllApprovalMatrix")
        {
            return this.approvalMatrixBusinessService.getAllMatrix();
        }

        else if(this.actioncd =="getAllMatrixByAccess")
        {
            return this.approvalMatrixBusinessService.getAllMatrixByAccess();
        }
        else if(this.actioncd == "updateMatrixTbl")
        {
            return this.approvalMatrixBusinessService.updateMatrixTbl(this.objData);
        }
        else if(this.actioncd =="insertRoleTbl")
        {
            return this.roleBusinessService.insertRoleTbl(this.objData);
        }

        else if(this.actioncd =="getAllRole")
        {
            return this.roleBusinessService.getAllRole();
        }

        else if(this.actioncd =="getCodeValByName")
        {
            this.name = this.objData.name;
            return this.manageConfigBusinessService.getCodeValByName(this.name);
        }
        else if(this.actioncd =="insertFormTbl")
        {
            return this.manageConfigBusinessService.insertIntoFormTbl(this.objData);
        }

        else if(this.actioncd =="getAllFormData")
        {
            return this.manageConfigBusinessService.getAllFormData();
        }

        else if(this.actioncd =="getAllFormListData")
        {
            return this.manageConfigBusinessService.getAllFormListData();
        }

        else if(this.actioncd =="updateFormTbl")
        {
            return this.manageConfigBusinessService.updateFormTbl(this.objData);
        }
        else if(this.actioncd =="updateFormMatrixTbl")
        {
            return this.manageConfigBusinessService.updateFormMatrixTbl(this.objData);
        }
        else if(this.actioncd =="insertMatrixTbl")
        {
            return this.manageConfigBusinessService.insertApprovalMatrix(this.objData);
        }
        else if(this.actioncd =="insertIntoRangeTable")
        {
            return this.manageConfigBusinessService.insertIntoNumberRngTbl(this.objData);
        }

        else if(this.actioncd =="getAllNumberRange")
        {
            return this.manageConfigBusinessService.getAllNumberRange();
        }

        else if(this.actioncd =="getDocumentRangeByid")
        {
            return this.manageConfigBusinessService.getDocumentRangeByid(this.objData);
        }
        else if(this.actioncd =="getLoanReportFields")
        {
            return this.manageConfigBusinessService.getLoanReportFields(this.objData);
        }
        else if(this.actioncd =="getBusinessPartnerReport")
        {
            return this.bpReport.getBusinessPartnerReport(this.objData);
        }
        else if(this.actioncd=='getInterestCalculation')
        {
            return this.manageConfigBusinessService.getInterestCalculation();
        }
        else if(this.actioncd=='updateInterestCalculation')
        {
            return this.manageConfigBusinessService.updateInterestCalculation(this.objData);
        }
        else if(this.actioncd=='insertIntoPaymentConfigTbl')
        {
            return this.manageConfigBusinessService.insertIntoPaymentConfigTbl(this.objData);
        }
        else if(this.actioncd=='getPaymentConfig')
        {
            return this.manageConfigBusinessService.getPaymentConfig();
        }
        else 
        {
            // Return an Observable with error for unsupported actions
            return Observable.create((observer) => {
                observer.error({
                    message: "Unsupported action code: " + this.actioncd,
                    statusCode: 400
                });
            });
        }
    }

}
