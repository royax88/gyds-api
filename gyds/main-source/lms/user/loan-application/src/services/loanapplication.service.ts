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
        console.log("event", event)
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

        console.log("this.objData.userRole", this.objData.userRole)
        if(this.actioncd=='insertIntoLoanTbl')
        {
            return this.loanApplicationBusinessService.insertIntoLoanTable(this.objData);
        }
        
        else if(this.actioncd=='getLoanRequest')
        {
            this.username = this.objData.username;
            if (!this.username) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "username is required for getLoanRequest action",
                        statusCode: 400
                    });
                });
            }
            console.log("username", this.username)
            return this.loanApplicationBusinessService.getLoanRequest(this.username);
        }

        else if(this.actioncd=='searchDocNumber')
        {
            if (!this.objData.data) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "data object is required for searchDocNumber action",
                        statusCode: 400
                    });
                });
            }
            return this.loanApplicationBusinessService.searchDocNumber(this.objData.data);
        }

        else if(this.actioncd=='getLoanRequestByMatrix')
        {
            this.username = this.objData.username;
            if (!this.username) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "username is required for getLoanRequestByMatrix action",
                        statusCode: 400
                    });
                });
            }
            if (!this.objData.data) {
                return Observable.create((observer) => {
                    observer.error({
                        message: "data object is required for getLoanRequestByMatrix action",
                        statusCode: 400
                    });
                });
            }
            // Extract the data object which contains userRole and other filters
            const dataObj = this.objData.data;
            if(dataObj.userRole == "releaseOfficer")
            {
                return this.loanApplicationBusinessService.getReleaseLoan(this.username, dataObj)
            }
            else {
                return this.loanApplicationBusinessService.getLoanByMatrixByProcessorV2(this.username, dataObj);
            }
        }

        else if(this.actioncd=='getRequestForReview')
        {
            this.username = this.objData.username;
            this.identifier = this.objData.identifier;
            return this.loanApplicationBusinessService.getLoanByMatrixByReviewer(this.username, this.identifier);
        }

        else if(this.actioncd=='getLoanRequestById')
        {
            this.loankey = this.objData.loankey;
            this.username = this.objData.usernm;
            this.roleAccess = this.objData.roleaccess;
            return this.loanApplicationBusinessService.getLoanRequestById(this.loankey, this.username, this.roleAccess);
        }

        else if(this.actioncd=='getAllLoanTransaction')
        {
            return this.loanApplicationBusinessService.getAllForms();
        }

        else if(this.actioncd=='updateLoantransaction')
        {
            this.roleAccess = this.objData;
            return this.loanApplicationBusinessService.updateLoanTransaction(this.objData, this.roleAccess.role);
        }

        else if(this.actioncd=='updateLoantransByProcessor')
        {
            return this.loanApplicationBusinessService.updateLoantransByProcessor(this.objData);
        }

        else if(this.actioncd=='getCommentsHistory')
        {
            this.loankey = this.objData.loankey;
            return this.loanApplicationBusinessService.getCommentsHistory(this.loankey);
        }
        else if(this.actioncd=='calculateNetProceeds')
        {
            return this.loanApplicationBusinessService.calculateNetProceeds(this.objData);
        }

        else if(this.actioncd=='updateLoanByRelease')
        {
            return this.loanApplicationBusinessService.updateLoanByRelease(this.objData);
        }

        else if(this.actioncd=='updateReleaseForm')
        {
            return this.loanApplicationBusinessService.updateReleaseForm(this.objData);
        }

        else if(this.actioncd=='generateLoanAppReport')
        {
            return this.loanReport.generateLoanAppReport(this.objData);
        }

        else if(this.actioncd=='generateLoanReceivableReport')
        {
            return this.loanReport.generateLoanReceivableReport(this.objData);
        }

        else if(this.actioncd=='generateLoanChargesReport')
        {
            return this.loanReport.generateLoanChargesReport(this.objData);
        }

        else if(this.actioncd=='generateInterestCalculationReport')
        {
            return this.interestCal.generateInterestCalcReport(this.objData);
        }

        else if(this.actioncd=='postInterestCalculationReport')
        {
            return this.interestCal.postInterestCalculationReport(this.objData);
        }

        else if(this.actioncd=='generatePaymentReceipt')
        {
            return this.paymentReceipt.generatePaymentReceipt(this.objData);
        }
        
        else if(this.actioncd=='postPayments')
        {
            return this.paymentReceipt.postPayments(this.objData);
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
