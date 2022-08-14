import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { LoanApplicationBusinessService} from '../business-service/loan-application-business-service';

export class LoanApplicationService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
    loankey: any;
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
            console.log("username", this.username)
            return this.loanApplicationBusinessService.getLoanByMatrix(this.username);
        }

        else if(this.actioncd=='getLoanRequestById')
        {
            if(process.env['localenv']==="true")
            {
                this.loankey = event.body.loankey;
            }
            else
            {
                this.loankey = JSON.parse(event.body).loankey;
            
            }
            console.log("loankey", this.loankey)
            return this.loanApplicationBusinessService.getLoanRequestById(this.loankey);
        }
    }

}
