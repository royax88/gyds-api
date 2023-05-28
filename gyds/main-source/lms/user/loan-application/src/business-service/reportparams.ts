import {v4 as uuidv4} from 'uuid';
var dateFormat = require('dateformat');

export class LoanReportNoSQLParams { 

    public loanTbl: string;
    public loanChargeTbl: string; 
    public loanReceivable: string;
    public paymentDocNumberTbl: string;

    constructor() {
        this.setNoSqlTables();
    }

    public getLoanAppByCompany(company: any) {
        let params = {
        TableName: this.loanTbl,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanChargeReport(company: any) {
        let params = {
        TableName: this.loanChargeTbl,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanReceivableReport(company: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'addtlCompany-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanReceivableReportById(id) {
        let params = {
        TableName: this.loanReceivable,
        KeyConditionExpression: '#id =:id',
            ExpressionAttributeNames: {
                '#id' : 'id'
            },
            ExpressionAttributeValues: {
                ':id': id
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLastLoanReceiveData(loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'isLastIndicator-loankey-index',
        KeyConditionExpression: '#isLastIndicator =:isLastIndicator and #loankey =:loankey',
            ExpressionAttributeNames: {
                '#isLastIndicator' : 'isLastIndicator',
                '#loankey' : 'loankey'
            },
            ExpressionAttributeValues: {
                ':isLastIndicator': "1",
                ':loankey': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getAllLoanReceiveDataByLoanKey(loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'loankey-index',
        KeyConditionExpression: '#loankey =:loankey',
            ExpressionAttributeNames: {
                '#loankey' : 'loankey'
            },
            ExpressionAttributeValues: {
                ':loankey': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getAllLoanReceiveDataByLoanKeyReverseInd(loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'loankey-isReverseIndicator-index',
        KeyConditionExpression: '#loankey =:loankey and #isReverseIndicator =:isReverseIndicator',
            ExpressionAttributeNames: {
                '#loankey' : 'loankey',
                '#isReverseIndicator' : 'isReverseIndicator'
            },
            ExpressionAttributeValues: {
                ':loankey': loankey,
                ':isReverseIndicator': "0"
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLoanAppByCompanyByStatus(company: any) {
        let params = {
        TableName: this.loanTbl,
        IndexName: 'addtlCompany-statusVal-index',
        KeyConditionExpression: '#addtlCompany =:addtlCompany and #statusVal =:statusVal',
            ExpressionAttributeNames: {
                '#addtlCompany' : 'addtlCompany',
                '#statusVal' : 'statusVal'
            },
            ExpressionAttributeValues: {
                ':addtlCompany': company,
                ':statusVal': "Released"
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public checkExistingProRateAndInterestReceivable(interestDueDate: any, loankey: any) {
        let params = {
        TableName: this.loanReceivable,
        IndexName: 'interestDueDate-loankey-index',
        KeyConditionExpression: '#interestDueDate =:interestDueDate and #loankey =:loankey',
            ExpressionAttributeNames: {
                '#interestDueDate' : 'interestDueDate',
                '#loankey' : 'loankey'
            },
            ExpressionAttributeValues: {
                ':interestDueDate': interestDueDate,
                ':loankey': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public getLastPaymentDocumentNbr(companycd: any) {
        let params = {
        TableName: this.paymentDocNumberTbl,
        IndexName: 'companyCd-lastIndicator-index',
        KeyConditionExpression: '#companyCd =:companyCd and #lastIndicator =:lastIndicator',
            ExpressionAttributeNames: {
                '#companyCd' : 'companyCd',
                '#lastIndicator' : 'lastIndicator'
            },
            ExpressionAttributeValues: {
                ':companyCd': companycd,
                ':lastIndicator': "1"
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public insertIntoPaymentDocumentNbr(companyCd: any, countVal: any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.paymentDocNumberTbl,
        Item: {
            'id' : uuidv4(),
            'companyCd': companyCd,
            'lastIndicator': "1",
            'countVal' : countVal
        }
        };
        return finalParams;
    }

    public updatePaymentDocumentNbr(id)
    {
        let finalParams: any = {
        TableName: this.paymentDocNumberTbl,
        Key: {
            id: id
        },
        UpdateExpression: "set lastIndicator = :lastIndicator",
            ExpressionAttributeValues:{
                ":lastIndicator" : "0"
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertIntoReceivableReportTbl(obj:any)
    {
        let overYearInd : any = "0";
        if(obj.remarks== "Interest Receivable" && obj.overYearIndForInterestReceivable == true)
        {
            overYearInd = "1";
        }
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.loanReceivable,
        Item: {
            'id' : uuidv4(),
            'loankey' : obj.loankey,
            'addtlCompany': obj.companyCode,
            'addtlCompanyValue': obj.company,
            'applicantFirstNm': obj.applicantCode,
            'applicantLastNm': obj.applicantName,
            'comakerFirstNm': obj.coMakerCode,
            'comakerLastNm': obj.coMakerName,
            'applicationDate': obj.applicationDate,
            'LRloanReleaseDt': obj.releaseDate,
            'docNumber': obj.loanForm,
            'updatedBy': obj.releasedBy,
            'addtlCollectionGroup': obj.addtlCollectionGroup,
            'addtlCollectionGroupValue': obj.addtlCollectionGroupValue,
            'addtlCollectionAgent': obj.addtlCollectionAgent,
            'addtlCollectionAgentValue': obj.addtlCollectionAgentValue,
            'amountVal': obj.calculatedInterest,
            'remarksVal': obj.remarks,
            'promissoryInterestRate': obj.interestRate,
            'promissoryScheme': obj.interestSchemeCode,
            'promissorySchemeValue': obj.interestScheme,
            'promissoryPaymentTerm': obj.paymentTermCode,
            'promissoryPaymentTermValue': obj.paymentTerm,
            'createdDate': day,
            'isLastIndicator': '1',
            'isOneYearIndicator': overYearInd,
            'promissoryCurrency' : obj.currency,
            'calculatedInterest': obj.calculatedInterest,
            'interestCalculationDate': obj.interestCalculationDate,
            'interestDueDate': obj.interestDueDate,
            'isReverseIndicator': obj.remarks == "Reversed Pro-rated Interest" ? "1" : "0"
        }
        };
        return finalParams;
    }

    public insertIntoReceivableReportTblByPostPayment(obj:any, remarks: any, status: any, paymentObj: any, paymentObjVal: any, paymentDocNUmber: any)
    {
        let newAmount: any;
        if(paymentObjVal.exchangeRate != "" && paymentObjVal.exchangeRate != undefined)
        {   
            newAmount = paymentObjVal.amountPaid == "" ? "" : Number(paymentObjVal.amountPaid) * Number(paymentObjVal.exchangeRate)
        }
        else {
            newAmount = paymentObjVal.amountPaid
        }
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.loanReceivable,
        Item: {
            'id' : uuidv4(),
            'loankey' : obj.loankey,
            'addtlCompany': obj.addtlCompany,
            'addtlCompanyValue': obj.addtlCompanyValue,
            'applicantFirstNm': obj.applicantFirstNm,
            'applicantLastNm': obj.applicantLastNm,
            'comakerFirstNm': obj.comakerFirstNm,
            'comakerLastNm': obj.comakerLastNm,
            'applicationDate': obj.applicationDate,
            'LRloanReleaseDt': obj.LRloanReleaseDt,
            'docNumber': obj.docNumber,
            'updatedBy': obj.updatedBy,
            'addtlCollectionGroup': obj.addtlCollectionGroup,
            'addtlCollectionGroupValue': obj.addtlCollectionGroupValue,
            'addtlCollectionAgent': obj.addtlCollectionAgent,
            'addtlCollectionAgentValue': obj.addtlCollectionAgentValue,
            'amountVal': obj.amountVal,
            'remarksVal': remarks,
            'promissoryInterestRate': obj.promissoryInterestRate,
            'promissoryScheme': obj.promissoryScheme,
            'promissorySchemeValue': obj.promissorySchemeValue,
            'promissoryPaymentTerm': obj.promissoryPaymentTerm,
            'promissoryPaymentTermValue': obj.promissoryPaymentTermValue,
            'createdDate': day,
            'isLastIndicator': '0',
            'isOneYearIndicator': obj.isOneYearIndicator,
            'promissoryCurrency' : obj.promissoryCurrency,
            'calculatedInterest': obj.calculatedInterest,
            'interestCalculationDate': obj.interestCalculationDate,
            'interestDueDate': obj.interestDueDate,
            'isReverseIndicator': obj.isReverseIndicator,
            'isForPayment' : "1",
            'statusVal' : status,
            'amountPaid' : newAmount, 
            'paymentReference' : paymentObjVal.paymentReference,
            'paymentDoc' : paymentDocNUmber,
            'paymentDate' : dateFormat(paymentObjVal.paymentDate, "yyyy-mm-dd"),
        }
        };
        return finalParams;
    }

    public updateLastIndicator(id, remarks)
    {
        let isReverseInd : any = "0";
        if(remarks == "Pro-rated Interest" || remarks == "Reversed Pro-rated Interest")
        {
            isReverseInd = "1";
        }
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanReceivable,
        Key: {
            id: id
        },
        UpdateExpression: "set isLastIndicator = :isLastIndicator, updatedDate = :updatedDate,  isReverseIndicator = :isReverseIndicator",
            ExpressionAttributeValues:{
                ":isLastIndicator" : "0",
                ":updatedDate" : day,
                ":isReverseIndicator" : isReverseInd
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateLoanWithInterestReceivable(loankey)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanTbl,
        Key: {
            loankey: loankey
        },
        UpdateExpression: "set isInterestReceivable = :isInterestReceivable",
            ExpressionAttributeValues:{
                ":isInterestReceivable" : "true"
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateLoanReceivableForPostPayments(objData: any, paymentDocNumber)
    {
        let newAmount : any = "";
        

        if(objData.paymentStatus == "Fully paid")
        {
            if((objData.remarks == "Previous outstanding balance" || objData.remarks  == "Interest Paid"))
            {
                let originalAmount =  objData.amount.split("-");
                originalAmount = originalAmount[1];
                newAmount = originalAmount;
            }
            else {
                newAmount = objData.amount;
            }
          
        }
        else {
            newAmount = objData.amountPaid2 == "" || objData.amountPaid2 == undefined ? "" : objData.amountPaid2;
        }
        // else {
        //     if(objData.isWithChange)
        //     {
        //         if((objData.remarks == "Previous outstanding balance" || objData.remarks  == "Interest Paid"))
        //         {
        //             let originalAmount: any = "";
        //             if(objData.amountPaid2 != "" && objData.amountPaid2 != undefined)
        //             {
        //                 originalAmount =  objData.amountPaid2.split("-");
        //                 originalAmount = originalAmount[1];
        //             }
        //             else {
        //                 originalAmount =  objData.amountPaid2 == "" || objData.amountPaid2 == undefined ? 0 : objData.amountPaid2;
        //             }
        //             newAmount = Number(objData.amountPaid) + Number(originalAmount);
        //             newAmount = newAmount;
        //         }   
        //         else {
        //             let newAmountPaid2 : any; 
        //             newAmountPaid2 = objData.amountPaid2 == "" || objData.amountPaid2 == undefined ? 0 : objData.amountPaid2;
        //             newAmount = Number(objData.amountPaid) + Number(newAmountPaid2);
        //         }
        //     }
           
        // }

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanReceivable,
        Key: {
            id: objData.id
        },
        UpdateExpression: "set amountPaid = :amountPaid, statusVal = :statusVal,  updatedDate = :updatedDate, paymentReference = :paymentReference, paymentDoc = :paymentDoc, paymentDate = :paymentDate",
            ExpressionAttributeValues:{
                ":amountPaid" : newAmount.toString(),
                ":statusVal" : objData.paymentStatus,
                ":updatedDate" : day,
                ":paymentReference" : objData.paymentStatus == "Fully paid" || objData.paymentStatus == "Partially paid" ? objData.paymentReference : "",
                ":paymentDoc" : objData.paymentStatus == "Fully paid" || objData.paymentStatus == "Partially paid" ?  paymentDocNumber : "",
                ":paymentDate" : objData.paymentStatus == "Fully paid" || objData.paymentStatus == "Partially paid" ? dateFormat(objData.paymentDate, "yyyy-mm-dd") : ""
            }, 
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
        this.loanChargeTbl = "gyds-lms-loan-charge-report-" + process.env['environment_tag'];
        this.loanReceivable = "gyds-lms-loan-receivable-report-" + process.env['environment_tag'];
        this.paymentDocNumberTbl = "gyds-lms-config-payment-doc-number-" + process.env['environment_tag'];
    }
}