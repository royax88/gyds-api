import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { ManageConfigBusinessService} from '../business-service/manage-config-business-service';
import {BusinssPartnerBusinessService} from '../business-service/businesspartner.service';
import {ApprovalMatrixPartnerBusinessService} from '../business-service/approvalmatrix.service';
import {RoleBusinessService} from '../business-service/role.service';
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
    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        
        if(process.env['localenv']==="true")
        {
            this.actioncd = event.body.actioncd;
        }
        else
        {
            this.actioncd = JSON.parse(event.body).actioncd;
          
        }

        if(this.actioncd=='getConfig')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getConfigValules(this.name);
        }
        else if(this.actioncd=='getConfigByName')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getConfigByName(this.name);
        }
        else if(this.actioncd=='insertIntoConfigTbl')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body
            }
            else
            {
                this.objData = JSON.parse(event.body)
            
            }
            return this.manageConfigBusinessService.insertConfig(this.objData, this.objData.data.name);
        }
        else if(this.actioncd=='updateConfigTbl')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body
            }
            else
            {
                this.objData = JSON.parse(event.body)
            
            }
            return this.manageConfigBusinessService.updateConfig(this.objData, this.objData.data.name);
        }
        else if(this.actioncd=='getAllConfigurationByName')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getAllConfigurationByName(this.name);
        }

        else if(this.actioncd=='getAllDataViaScan')
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getAllData(this.name);

        }
        else if(this.actioncd=='insertIntoBusinessPartner')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.businssPartnerBusinessService.insertBusinessPartner(this.objData);
        }

        else if(this.actioncd=='updateIntoBusinessPartner')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
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
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.approvalMatrixBusinessService.updateMatrixTbl(this.objData);
        }
        else if(this.actioncd =="insertRoleTbl")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.roleBusinessService.insertRoleTbl(this.objData);
        }

        else if(this.actioncd =="getAllRole")
        {
            return this.roleBusinessService.getAllRole();
        }

        else if(this.actioncd =="getCodeValByName")
        {
            if(process.env['localenv']==="true")
            {
                this.name = event.body.name;
            }
            else
            {
                this.name = JSON.parse(event.body).name;
            
            }
            return this.manageConfigBusinessService.getCodeValByName(this.name);
        }

        else if(this.actioncd =="insertFormTbl")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
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
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.manageConfigBusinessService.updateFormTbl(this.objData);
        }

        else if(this.actioncd =="updateFormMatrixTbl")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.manageConfigBusinessService.updateFormMatrixTbl(this.objData);
        }

        else if(this.actioncd =="insertMatrixTbl")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.manageConfigBusinessService.insertApprovalMatrix(this.objData);
        }

        else if(this.actioncd =="insertIntoRangeTable")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.manageConfigBusinessService.insertIntoNumberRngTbl(this.objData);
        }

        else if(this.actioncd =="getAllNumberRange")
        {
            return this.manageConfigBusinessService.getAllNumberRange();
        }

        else if(this.actioncd =="getDocumentRangeByid")
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.manageConfigBusinessService.getDocumentRangeByid(this.objData);
        }
    }

}
