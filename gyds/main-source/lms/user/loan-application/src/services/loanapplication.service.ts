import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { LoanApplicationBusinessService} from '../business-service/loan-application-business-service';

export class LoanApplicationService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
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
    }

}