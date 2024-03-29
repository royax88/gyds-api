import { Observable } from 'rxjs/Observable';
import { HomePageModel } from '../models/HomePageModel';
import { LoanApplicationBusinessService} from '../business-service/loan-application-business-service';
import {LoanReportBusinessService} from '../business-service/loan-report-business-service';
import {LoanInterestCalculationBusinessService} from '../business-service/loan-report-interest-calc-service';
import {LoanPaymentReceiptBusinessService} from '../business-service/loan-report-payment-service'
import { resolve } from 'url';

export class LoanApplicationService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    name: any;
    loankey: any;
    roleAccess: any;
    identifier: any;
    private loanApplicationBusinessService = new LoanApplicationBusinessService();
    private loanReport = new LoanReportBusinessService();
    private interestCal = new LoanInterestCalculationBusinessService();
    private paymentReceipt = new LoanPaymentReceiptBusinessService();

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

        else if(this.actioncd=='searchDocNumber')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            
            }
            return this.loanApplicationBusinessService.searchDocNumber(this.objData.data);
        }

        else if(this.actioncd=='getLoanRequestByMatrix')
        {
            if(process.env['localenv']==="true")
            {
                this.username = event.body.username;
                this.objData = event.body.data;
            }
            else
            {
                this.username = JSON.parse(event.body).username;
                this.objData = JSON.parse(event.body).data;
            }
            if(this.objData.userRole == "releaseOfficer")
            {
                return this.loanApplicationBusinessService.getReleaseLoan(this.username, this.objData)
            }
            else {
                return this.loanApplicationBusinessService.getLoanByMatrixByProcessorV2(this.username, this.objData);
            }
           
        }

        else if(this.actioncd=='getRequestForReview')
        {
            if(process.env['localenv']==="true")
            {
                this.username = event.body.username;
                this.identifier = event.body.identifier;
            }
            else
            {
                this.username = JSON.parse(event.body).username;
                this.identifier = JSON.parse(event.body).identifier;
            }   
            return this.loanApplicationBusinessService.getLoanByMatrixByReviewer(this.username, this.identifier);
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
                this.roleAccess = event.body
            }
            else
            {
                this.objData = JSON.parse(event.body);
                this.roleAccess = JSON.parse(event.body);
            }
            return this.loanApplicationBusinessService.updateLoanTransaction(this.objData, this.roleAccess.role);
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
        else if(this.actioncd=='calculateNetProceeds')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }
            return this.loanApplicationBusinessService.calculateNetProceeds(this.objData);
        }

        else if(this.actioncd=='updateLoanByRelease')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }
            return this.loanApplicationBusinessService.updateLoanByRelease(this.objData);
        }

        else if(this.actioncd=='updateReleaseForm')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }
            return this.loanApplicationBusinessService.updateReleaseForm(this.objData);
        }

        else if(this.actioncd=='generateLoanAppReport')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.loanReport.generateLoanAppReport(this.objData);
        }

        else if(this.actioncd=='generateLoanReceivableReport')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.loanReport.generateLoanReceivableReport(this.objData);
        }

        else if(this.actioncd=='generateLoanChargesReport')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.loanReport.generateLoanChargesReport(this.objData);
        }

        else if(this.actioncd=='generateInterestCalculationReport')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.interestCal.generateInterestCalcReport(this.objData);
        }

        else if(this.actioncd=='postInterestCalculationReport')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.interestCal.postInterestCalculationReport(this.objData);
        }

        else if(this.actioncd=='generatePaymentReceipt')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.paymentReceipt.generatePaymentReceipt(this.objData);
        }

        
        else if(this.actioncd=='postPayments')
        {
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = JSON.parse(event.body);
            }   
            return this.paymentReceipt.postPayments(this.objData);
        }
    }
    

}
