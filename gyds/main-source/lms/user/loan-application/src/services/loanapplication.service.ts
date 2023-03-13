import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { LoanApplicationBusinessService} from '../business-service/loan-application-business-service';
import { resolve } from 'url';

export class LoanApplicationService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
    loankey: any;
    roleAccess: any;
    private loanApplicationBusinessService = new LoanApplicationBusinessService();

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

        if(this.actioncd=='insertIntoLoanTbl')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.loanApplicationBusinessService.insertIntoLoanTable(this.objData);
        }
        

        else if(this.actioncd=='getLoanRequest')
        {
            if(process.env['localenv']==="true")
            {
                this.username = event.body.username;
            }
            else
            {
                this.username = JSON.parse(event.body).username;
            
            }
            console.log("username", this.username)
            return this.loanApplicationBusinessService.getLoanRequest(this.username);
        }

        else if(this.actioncd=='getLoanRequestByMatrix')
        {
            if(process.env['localenv']==="true")
            {
                this.username = event.body.username;
            }
            else
            {
                this.username = JSON.parse(event.body).username;
            
            }
            return this.loanApplicationBusinessService.getLoanByMatrixByProcessorV2(this.username);
        }

        else if(this.actioncd=='getRequestForReview')
        {
            if(process.env['localenv']==="true")
            {
                this.username = event.body.username;
            }
            else
            {
                this.username = JSON.parse(event.body).username;
            
            }
            return this.loanApplicationBusinessService.getLoanByMatrixByReviewer(this.username);
        }

        else if(this.actioncd=='getLoanRequestById')
        {
            if(process.env['localenv']==="true")
            {
                this.loankey = event.body.loankey;
                this.username = event.body.usernm;
                this.roleAccess = event.body.roleaccess;
            }
            else
            {
                this.loankey = JSON.parse(event.body).loankey;
                this.username = JSON.parse(event.body).usernm;
                this.roleAccess = JSON.parse(event.body).roleaccess;
            }
            return this.loanApplicationBusinessService.getLoanRequestById(this.loankey, this.username, this.roleAccess);
        }

        else if(this.actioncd=='getAllLoanTransaction')
        {
            return this.loanApplicationBusinessService.getAllForms();
        }

        else if(this.actioncd=='updateLoantransaction')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.loanApplicationBusinessService.updateLoanTransaction(this.objData);
        }

        else if(this.actioncd=='updateLoantransByProcessor')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.loanApplicationBusinessService.updateLoantransByProcessor(this.objData);
        }

        else if(this.actioncd=='getCommentsHistory')
        {
            if(process.env['localenv']==="true")
            {
                this.loankey = event.body.loankey;
            }
            else
            {
                this.loankey = JSON.parse(event.body).loankey;
            }
            return this.loanApplicationBusinessService.getCommentsHistory(this.loankey);
        }
    }
    

}
