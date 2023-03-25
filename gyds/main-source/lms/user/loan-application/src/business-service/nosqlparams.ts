var dateFormat = require('dateformat');
import {v4 as uuidv4} from 'uuid';

export class LoanApplicationNoSQLParams {

    public loanTbl: string;
    public  tblNmL: string;
    public commentsTbl: string;
    constructor() {
        this.setNoSqlTables();
    }


    public insertIntoUserTable(obj:any, loankey: any, formid: any, incVal: any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.loanTbl,
        Item: {
            'loankey' : uuidv4(),
            'statusVal' : 'Processed',
            'applicantLastNm': obj.data.firstAppLastName,
            'applicantFirstNm': obj.data.firstAppFirstName,
            'applicantMiddleNm': obj.data.firstAppMiddleName,
            'applicantCivilStatus': obj.data.firstAppCivilStatus,
            'comakerLastNm': obj.data.firstcoMakerAppLastName,
            'comakerFirstNm': obj.data.firstcoMakerFirstName,
            'comakerMiddleNm': obj.data.firstcoMakerMiddleName,
            'comakerCivilstatus': obj.data.firstcoMakerCivilStatus,
            'addtlCompany': obj.data.firstcompanySelect == undefined || obj.data.firstcompanySelect == "" ? "" : obj.data.firstcompanySelect.code,
            'addtlCollectionGroup': obj.data.firstcollectionSelect == undefined || obj.data.firstcollectionSelect == "" ? "" : obj.data.firstcollectionSelect.code,
            'addtlCollectionAgent': obj.data.firstcollectionAgentSelect == undefined || obj.data.firstcollectionAgentSelect == "" ? "" : obj.data.firstcollectionAgentSelect.code ,
            'applicationDate': obj.data.firstapplicationDate.year + "-" + obj.data.firstapplicationDate.month + "-" + obj.data.firstapplicationDate.day,
            'affidavitUTAmount' : obj.data.secondAmount,
            'affidavitUTCurrency': obj.data.secondCurrency == undefined || obj.data.secondCurrency == "" ? "" : obj.data.secondCurrency.code,
            'affidavitUTInwords': obj.data.secondInwords,
            'affidavitUTType': obj.data.secondundertakingTypeselect == undefined || obj.data.secondundertakingTypeselect == "" ? "" : obj.data.secondundertakingTypeselect.code,
            'affidavitUTDetail1' : obj.data.secondDetail1 == undefined ? "" : obj.data.secondDetail1,
            'affidavitUTDetail2' : obj.data.secondDetail2 == undefined ? "" : obj.data.secondDetail2,
            'affidavitCMAmount' : obj.data.thirdAmount,
            'affivaditCMCurrency': obj.data.thirdCurrency == undefined || obj.data.thirdCurrency == "" ? "" : obj.data.thirdCurrency.code,
            'affidavitCMInWords' : obj.data.thirdInwords,
            'affidavitCMType': obj.data.thirdundertakingTypeCoselect == undefined || obj.data.thirdundertakingTypeCoselect == "" ? "" : obj.data.thirdundertakingTypeCoselect.code,
            'affidavitCMDetail1': obj.data.thirdDetail1 == undefined ? "" : obj.data.thirdDetail1,
            'affidavitCMDetail2': obj.data.thirdDetail2 == undefined ? "" : obj.data.thirdDetail2,
            'promissoryAmount' : obj.data.fourthAmount,
            'promissoryCurrency' : obj.data.fourthCurrency == undefined || obj.data.fourthCurrency == "" ? "" : obj.data.fourthCurrency.code,
            'promissoryInWords' : obj.data.fourthInwords,
            'promissoryDateOfLoan': obj.data.fourthpromissoryDateOfLoan.year + "-" + obj.data.fourthpromissoryDateOfLoan.month + "-" + obj.data.fourthpromissoryDateOfLoan.day,
            'promissoryLoanPeriod': '0-0-0',
            'promissoryLoanPurpose' : obj.data.fourthLoanPurpose,
            'promissoryInterestRate' : obj.data.fourthInterestRate,
            'promissoryScheme': obj.data.fourthpromissorySchemeSelected == undefined || obj.data.fourthpromissorySchemeSelected == "" ? "" : obj.data.fourthpromissorySchemeSelected.code,
            'promissoryPaymentTerm' : obj.data.fourthpromissoryPaymentTermSelected == undefined || obj.data.fourthpromissoryPaymentTermSelected == "" ? "" : obj.data.fourthpromissoryPaymentTermSelected.code,
            'createdDate': day,
            'updatedDate': day,
            'createdBy' : obj.data.createdBy,
            'updatedBy' : obj.data.createdBy,
            'username' : obj.data.username,
            'secondTabCheckbox' : obj.data.secondTabCheckbox,
            'thirdTabCheckbox' : obj.data.thirdTabCheckbox,
            'fourthTabCheckbox' : obj.data.fourthTabCheckbox,
            'formid': formid,
            'incrementValue': incVal,
            'formname' : obj.data.selectedForm,
            'docNumber' : loankey,
            'promisorryLoanPeriodYear' : obj.data.loanPeriodYear,
            'promisorryLoanPeriodMonth' : obj.data.loanPeriodMonth,
            'promisorryLoanPeriodDay' : obj.data.loanPeriodDay,
            'promissoryLinkForm1' : obj.data.promissoryLinkForm1,
            'promissoryLinkForm2' : obj.data.promissoryLinkForm2,
            'link1' : obj.data.link1,
            'link2' : obj.data.link2,
            "isDelete" : "0",
            "isForRelease": "0"
        }
        };
        return finalParams;
    }

    public viewLoanRequest(username: any) {
    
        let params = {
        TableName: this.loanTbl,
        IndexName: 'username-index',
        KeyConditionExpression: '#username =:username',
            ExpressionAttributeNames: {
                '#username' : 'username'
            },
            ExpressionAttributeValues: {
                ':username': username
            },
        ScanIndexForward: false 
     }
     return params;
    }

    public viewLoanRequestById(loankey: any) {
    
        let params = {
        TableName: this.loanTbl,
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

    public getFormId(val: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'formid-index',
            KeyConditionExpression: '#formid =:formid',
                ExpressionAttributeNames: {
                    '#formid' : 'formid'
                },
                ExpressionAttributeValues: {
                    ':formid': val 
                },
            ScanIndexForward: false 
         }
         return params;
    }

    public getLoanTranByStatusDoc(statusVal: any, docVal: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'docNumber-statusVal-index',
            KeyConditionExpression: '#docNumber =:docNumber and #statusVal =:statusVal',
            ExpressionAttributeNames: {
                '#docNumber' : 'docNumber',
                '#statusVal' : 'statusVal'
            },
            ExpressionAttributeValues: {
                ':docNumber': docVal,
                ':statusVal': statusVal
            },
             ScanIndexForward: false 
         }
         return params;
    }

    public getLoanTranByStatusFilter(statusVal: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'statusVal-index',
            KeyConditionExpression: '#statusVal =:statusVal',
            ExpressionAttributeNames: {
                '#statusVal' : 'statusVal'
            },
            ExpressionAttributeValues: {
                ':statusVal': statusVal
            },
             ScanIndexForward: false 
         }
         return params;
    }

    public getLoanTranByDocNumber(docVal: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'docNumber-index',
            KeyConditionExpression: '#docNumber =:docNumber',
            ExpressionAttributeNames: {
                '#docNumber' : 'docNumber'
            },
            ExpressionAttributeValues: {
                ':docNumber': docVal
            },
             ScanIndexForward: false 
         }
         return params;
    }

    public getLoanTransApplicationDate(appdate: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'applicationDate-index',
            KeyConditionExpression: '#applicationDate =:applicationDate',
            ExpressionAttributeNames: {
                '#applicationDate' : 'applicationDate'
            },
            ExpressionAttributeValues: {
                ':applicationDate': appdate
            },
             ScanIndexForward: false 
         }
         return params;
    }

    public getAllActive()
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'isDelete-index',
            KeyConditionExpression: '#isDelete =:isDelete',
                ExpressionAttributeNames: {
                    '#isDelete' : 'isDelete'
                },
                ExpressionAttributeValues: {
                    ':isDelete': "0" 
                },
            ScanIndexForward: false 
         }
         return params;
    }

    public getAllApproved(companyNm: any)
    {
        let params = {
            TableName: this.loanTbl,
            IndexName: 'isForRelease-addtlCompany-index',
            KeyConditionExpression: '#isForRelease =:isForRelease and #addtlCompany =:addtlCompany',
                ExpressionAttributeNames: {
                    '#isForRelease' : 'isForRelease',
                    '#addtlCompany' : 'addtlCompany'
                },
                ExpressionAttributeValues: {
                    ':isForRelease': "1",
                    ':addtlCompany': companyNm
                },
            ScanIndexForward: false 
         }
         return params;
    }

    public getLoanTransactionByStatus() {
    
        let params = {
        TableName: this.loanTbl
     }
     return params;
    }


    public updateLoanTransaction(obj:any, role: any)
    {
        let isForReleaseVal : any = 0;
        if(obj.data.status == "Approved" && obj.data.formName == "Promissory Note")
        {
            isForReleaseVal = "1";
        }

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanTbl,
        Key: {
            loankey: obj.data.id
        },
        UpdateExpression: "set statusVal = :statusVal, updatedBy = :updatedBy,isForRelease = :isForRelease, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":statusVal" : obj.data.status,
                ":updatedBy" : obj.data.user,
                ":isForRelease" : isForReleaseVal.toString(),
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateLoanTransByProcessor(obj:any)
    {
        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanTbl,
        Key: {
            loankey: obj.data.id
        },
        UpdateExpression: "set statusVal = :statusVal, updatedBy = :updatedBy, updatedDate = :updatedDate, applicantLastNm = :applicantLastNm, applicantCivilStatus = :applicantCivilStatus, comakerLastNm = :comakerLastNm," +
                           "comakerCivilstatus = :comakerCivilstatus, addtlCompany = :addtlCompany, addtlCollectionGroup = :addtlCollectionGroup, addtlCollectionAgent = :addtlCollectionAgent," +
                           "applicationDate = :applicationDate,affidavitUTAmount = :affidavitUTAmount, affidavitUTCurrency = :affidavitUTCurrency, affidavitUTInwords = :affidavitUTInwords," +
                           "affidavitUTType = :affidavitUTType,affidavitUTDetail1 = :affidavitUTDetail1,affidavitUTDetail2 = :affidavitUTDetail2,affidavitCMAmount = :affidavitCMAmount," + 
                           "affivaditCMCurrency = :affivaditCMCurrency,affidavitCMInWords = :affidavitCMInWords,affidavitCMType = :affidavitCMType,affidavitCMDetail1 = :affidavitCMDetail1," +
                           "affidavitCMDetail2 = :affidavitCMDetail2,promissoryAmount = :promissoryAmount,promissoryCurrency = :promissoryCurrency,promissoryInWords = :promissoryInWords," +
                           "promissoryDateOfLoan = :promissoryDateOfLoan,promissoryLoanPurpose = :promissoryLoanPurpose,promissoryInterestRate = :promissoryInterestRate,promissoryScheme = :promissoryScheme, promissoryPaymentTerm = :promissoryPaymentTerm, promisorryLoanPeriodYear = :promisorryLoanPeriodYear,  promisorryLoanPeriodMonth = :promisorryLoanPeriodMonth, promisorryLoanPeriodDay = :promisorryLoanPeriodDay, promissoryLinkForm1 = :promissoryLinkForm1, promissoryLinkForm2 = :promissoryLinkForm2, link1 = :link1, link2 = :link2",
            ExpressionAttributeValues:{
                ":statusVal" : obj.data.status,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day,
                ":applicantLastNm" : obj.data.firstAppLastName,
                ":applicantCivilStatus" : obj.data.firstAppCivilStatus,
                ":comakerLastNm" : obj.data.firstcoMakerAppLastName,
                ":comakerCivilstatus" : obj.data.firstcoMakerCivilStatus,
                ":addtlCompany" : obj.data.firstcompanySelect == undefined || obj.data.firstcompanySelect == "" ? "" : obj.data.firstcompanySelect,
                ":addtlCollectionGroup" : obj.data.firstcollectionSelect == undefined || obj.data.firstcollectionSelect == "" ? "" : obj.data.firstcollectionSelect,
                ":addtlCollectionAgent" : obj.data.firstcollectionAgentSelect == undefined || obj.data.firstcollectionAgentSelect == "" ? "" : obj.data.firstcollectionAgentSelect,
                ":applicationDate" : obj.data.firstapplicationDate.year + "-" + obj.data.firstapplicationDate.month + "-" + obj.data.firstapplicationDate.day,
                ":affidavitUTAmount" : obj.data.secondAmount,
                ":affidavitUTCurrency" : obj.data.secondCurrency == undefined || obj.data.secondCurrency == "" ? "" : obj.data.secondCurrency,
                ":affidavitUTInwords" : obj.data.secondInwords,
                ":affidavitUTType" : obj.data.secondundertakingTypeselect == undefined || obj.data.secondundertakingTypeselect == "" ? "" : obj.data.secondundertakingTypeselect,
                ":affidavitUTDetail1" : obj.data.secondDetail1 == undefined ? "" : obj.data.secondDetail1,
                ":affidavitUTDetail2" : obj.data.secondDetail2 == undefined ? "" : obj.data.secondDetail2,
                ":affidavitCMAmount" : obj.data.thirdAmount,
                ":affivaditCMCurrency" : obj.data.thirdCurrency == undefined || obj.data.thirdCurrency == "" ? "" : obj.data.thirdCurrency,
                ":affidavitCMInWords" : obj.data.thirdInwords,
                ":affidavitCMType" : obj.data.thirdundertakingTypeCoselect == undefined || obj.data.thirdundertakingTypeCoselect == "" ? "" : obj.data.thirdundertakingTypeCoselect,
                ":affidavitCMDetail1" : obj.data.thirdDetail1 == undefined ? "" : obj.data.thirdDetail1,
                ":affidavitCMDetail2" : obj.data.thirdDetail2 == undefined ? "" : obj.data.thirdDetail2,
                ":promissoryAmount" : obj.data.fourthAmount,
                ":promissoryCurrency" : obj.data.fourthCurrency == undefined || obj.data.fourthCurrency == "" ? "" : obj.data.fourthCurrency,
                ":promissoryInWords" : obj.data.fourthInwords,
                ":promissoryDateOfLoan" : obj.data.fourthpromissoryDateOfLoan.year + "-" + obj.data.fourthpromissoryDateOfLoan.month + "-" + obj.data.fourthpromissoryDateOfLoan.day,
                ":promissoryLoanPurpose" : obj.data.fourthLoanPurpose,
                ":promissoryInterestRate" : obj.data.fourthInterestRate,
                ":promissoryScheme" : obj.data.fourthpromissorySchemeSelected == undefined || obj.data.fourthpromissorySchemeSelected == "" ? "" : obj.data.fourthpromissorySchemeSelected,
                ":promissoryPaymentTerm" : obj.data.fourthpromissoryPaymentTermSelected == undefined || obj.data.fourthpromissoryPaymentTermSelected == "" ? "" : obj.data.fourthpromissoryPaymentTermSelected,
                ":promisorryLoanPeriodYear" : obj.data.loanPeriodYear,
                ":promisorryLoanPeriodMonth" : obj.data.loanPeriodMonth,
                ":promisorryLoanPeriodDay" : obj.data.loanPeriodDay,
                ":promissoryLinkForm1" : obj.data.promissoryLinkForm1,
                ":promissoryLinkForm2" : obj.data.promissoryLinkForm2,
                ":link1" : obj.data.link1,
                ":link2" : obj.data.link2
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public updateLoanByRelease(obj:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");
        let finalParams: any = {
        TableName: this.loanTbl,
        Key: {
            loankey: obj.data.id
        },
        UpdateExpression: "set LRoutstandingBalance = :LRoutstandingBalance, LRserviceFee = :LRserviceFee,LRinsuranceVal = :LRinsuranceVal,LRothercharges = :LRothercharges,LRinterestAmt = :LRinterestAmt,LRloanReleaseDt = :LRloanReleaseDt,LRNetProceed = :LRNetProceed, statusVal = :statusVal, updatedBy = :updatedBy, updatedDate = :updatedDate",
            ExpressionAttributeValues:{
                ":LRoutstandingBalance" : obj.data.balance,
                ":LRserviceFee" : obj.data.servicefee,
                ":LRinsuranceVal" : obj.data.insurance,
                ":LRothercharges" : obj.data.othercharges,
                ":LRinterestAmt" : obj.data.interestAmt.toString(),
                ":LRloanReleaseDt" : obj.data.loanReleaseDt.year + "-" + obj.data.loanReleaseDt.month + "-" + obj.data.loanReleaseDt.day,
                ":LRNetProceed" : obj.data.netProceed,
                ":statusVal" : obj.data.statusVal,
                ":updatedBy" : obj.data.user,
                ":updatedDate" : day
            },
            ReturnValues:"UPDATED_NEW"
        };
        return finalParams;
    }

    public insertCommentsTbl(obj:any, role?:any)
    {

        var day=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

        let finalParams: any = {
        TableName: this.commentsTbl,
        Item: {
            'primaryid' : uuidv4(),
            'formidval' : obj.data.id,
            'comments' : obj.data.comments,
            'statsVal' : obj.data.status,
            'user': obj.data.user,
            'userRole' : role,
            'audit': day
        }
        };
        return finalParams;
    }

    public getCommentsHistorybyId(loankey: any) {
    
        let params = {
        TableName: this.commentsTbl,
        IndexName: 'formidval-index',
        KeyConditionExpression: '#formidval =:formidval',
            ExpressionAttributeNames: {
                '#formidval' : 'formidval'
            },
            ExpressionAttributeValues: {
                ':formidval': loankey
            },
        ScanIndexForward: false 
     }
     return params;
    }

    private setNoSqlTables() {

        this.loanTbl = "gyds-lms-loan-application-" + process.env['environment_tag'];
        this.commentsTbl = "gyds-lms-comments-history-" + process.env['environment_tag'];
    }
    
}

