import { Observable } from 'rxjs/Observable';
import {LoanReportNoSQLParams} from '../business-service/reportparams';
import {LoanApplicationDataService} from '../data-service/loan-application-data-service';
import {LoanReportBusinessService} from './loan-report-business-service';
import {ManageConfigNoSQLParams} from '../../../../config/manage-configuration/src/business-service/nosqlparams';
var dateFormat = require('dateformat');


export class LoanInterestCalculationBusinessService {
    private reportParams = new LoanReportNoSQLParams();
    private loanApplicationDataService = new LoanApplicationDataService();
    private loanLogic = new LoanReportBusinessService();
    private configParams = new ManageConfigNoSQLParams();
    
    constructor() {

    }

    private isLoanDueDatePeriod(year: any, transMonth: any, transDay: any, loanReleaseDate: any, interestCalcDate: any)
    {
        let isDue: any = false;
        var dateInterset=dateFormat(new Date(interestCalcDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convdateInterset = new Date(dateInterset);


        var loanReleaseDt = dateFormat(loanReleaseDate, "yyyymmdd").toString();
        var yearVal = loanReleaseDt.substring(0, 4);
        var monthVal = loanReleaseDt.substring(4, 6);
        var dayVal = loanReleaseDt.substring(6, 8);

        let numyear : any = 0;
        let numMonth : any = 0;
        let numDay : any = 0;

       if(year != " " || year != "")
       {
        numyear = Number(yearVal) + Number(year);
       }

       if(transMonth != " " || transMonth != "")
       {
        numMonth = Number(monthVal) + Number(transMonth);
        if(numMonth > 12)
        {
            let diffMonth = numMonth - 12;
            numMonth = diffMonth;
            numyear = numyear + 1;
        }
       }
       else {
        numMonth = Number(transMonth);
       }


       if(transDay != " " || transDay != "")
       {
        numDay = Number(dayVal) + Number(transDay)
        if(numDay > 31)
        {
            let diffDay = numDay - 31;
            numDay = diffDay;
            numMonth = numMonth + 1;

        }
       }
       else {
        numDay = Number(transDay);
       }
       
       var newDate = dateFormat(new Date(numyear, numMonth - 1, numDay).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
       let convnewDate = new Date(newDate);

        if(convnewDate < convdateInterset)
        {
            isDue = true;
        }

        return isDue;

    }

    private calculateInterestDueDate(loanReleaseDate: any, interestSchemeObj: any, selectedScheme: any, loanPeriodYear: any, LoanPeriodMonth, loanPeriodDay)
    {
        let schemeVal : any;
        let newMonth: any = 0;
        let newDay: any = 0;
        let newYear: any = 0;
        let isAllowGracePeriod : any;
        let isProRata: any;
        let isAccrueReverse: any;
        let periodDetermination: any;
        let periodDeterminationDay: any;
        for(let item in interestSchemeObj)
        {
            if(interestSchemeObj[item].codeVal == selectedScheme)
            {
                schemeVal = interestSchemeObj[item].detail1;
                isAllowGracePeriod = interestSchemeObj[item].detail2;
                isProRata = interestSchemeObj[item].detail3;
                isAccrueReverse = interestSchemeObj[item].detail4;
                periodDetermination = interestSchemeObj[item].detail5;
                periodDeterminationDay = interestSchemeObj[item].detail6;
                break;
            }
        }
        var loanReleaseDt = dateFormat(loanReleaseDate, "yyyymmdd").toString();
        var yearVal = loanReleaseDt.substring(0, 4);
        var monthVal = loanReleaseDt.substring(4, 6);
        var dayVal = loanReleaseDt.substring(6, 8);
        if(schemeVal == "Monthly")
        {
            newMonth =  Number(monthVal) + 1;
            newDay = Number(dayVal);
            newYear = Number(yearVal);

            if(newMonth > 12)
            {
                newMonth = 1;
                newYear = Number(yearVal) + 1;
            }
            if(newDay > 31)
            {
                newDay = newDay - 31;
                newMonth = newMonth + 1;
                if(newMonth > 12)
                {
                    newMonth = 1;
                    newYear = Number(yearVal) + 1;
                }
            }

            if(newMonth == 2 && newDay > 28)
            {
                newDay = newDay - 28;
                newMonth = newMonth + 1;
            }

            var newDate = dateFormat(new Date(newYear, newMonth - 1, newDay).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");

            let newObj = {
                isAllowGracePeriod : isAllowGracePeriod,
                isProRata : isProRata,
                isAccrueReverse : isAccrueReverse,
                interestDueDate: newDate,
                periodDetermination: periodDetermination,
                periodDeterminationDay: periodDeterminationDay,
                schemeVal: schemeVal
            }

            return newObj;
        }

        if(schemeVal == "Daily")
        {
            newDay = Number(dayVal) + 1;
            newMonth =  Number(monthVal);
            newYear = Number(yearVal);

            if(newDay > 31)
            {
                newDay = newDay - 31;
                newMonth = newMonth + 1;
                if(newMonth > 12)
                {
                    newMonth = 1;
                    newYear = Number(yearVal) + 1;
                }
            }

            if(newMonth == 2 && newDay > 28)
            {
                newDay = newDay - 28;
                newMonth = newMonth + 1;
            }

            var newDate = dateFormat(new Date(newYear, newMonth - 1, newDay).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");

            let newObj = {
                isAllowGracePeriod : isAllowGracePeriod,
                isProRata : isProRata,
                isAccrueReverse : isAccrueReverse,
                interestDueDate: newDate,
                periodDetermination: periodDetermination,
                periodDeterminationDay: periodDeterminationDay,
                schemeVal: schemeVal
            }

            return newObj;
        }

        if(schemeVal == "Annual")
        {
            newYear =  Number(yearVal) + 1;
            newDay = Number(dayVal);
            newMonth = Number(monthVal);

            if(newDay > 31)
            {
                newDay = newDay - 31;
                newMonth = newMonth + 1;
                if(newMonth > 12)
                {
                    newMonth = 1;
                    newYear = Number(yearVal) + 1;
                }
            }

            if(newMonth == 2 && newDay > 28)
            {
                newDay = newDay - 28;
                newMonth = 3;
            }

            var newDate = dateFormat(new Date(newYear, newMonth - 1, newDay).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");

            let newObj = {
                isAllowGracePeriod : isAllowGracePeriod,
                isProRata : isProRata,
                isAccrueReverse : isAccrueReverse,
                interestDueDate: newDate,
                periodDetermination: periodDetermination,
                periodDeterminationDay: periodDeterminationDay,
                schemeVal: schemeVal
            }

            return newObj;
        }
    }

    private hasExpired(interestDueDate: any, uiInterestCalcDate: any)
    {
        
        let convinterestDueDate = new Date(interestDueDate);

        var dateInterset=dateFormat(new Date(uiInterestCalcDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convdateInterset = new Date(dateInterset);
        if(convinterestDueDate < convdateInterset)
        {
            return true;
        }
        else {
            return false;
        }
        
    }

    private DecimalIndicator(currencyObj, selectedCurrency)
    {
        let decimalInd : any;
        for(let item in currencyObj) 
        {
            if(selectedCurrency == currencyObj[item].codeVal)
            {
                decimalInd = currencyObj[item].detail2
                break;
            }
        }
        return decimalInd;
    }

    private calculateProRateInterestByLoanReleaseDt(frequency: any, periodDetermination: any, day: any, LRloanReleaseDt: any, uiCalculationDate: any, amount: any, interest: any,
        currencyObj: any, selectedCurrency: any, interestDueDate: any)
    {
        
        let decimalInd : any;
        for(let item in currencyObj) 
        {
            if(selectedCurrency == currencyObj[item].codeVal)
            {
                decimalInd = currencyObj[item].detail2
                break;
            }
        }

        var dateInterset=dateFormat(new Date(uiCalculationDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convdateInterset = new Date(dateInterset);

        var loanInterest=dateFormat(new Date(LRloanReleaseDt).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convloanInterest = new Date(loanInterest);

        var uiCalculationInterestToString = dateFormat(uiCalculationDate, "yyyymmdd").toString();
        var monthVal = uiCalculationInterestToString.substring(4, 6);
        var yearVal = uiCalculationInterestToString.substring(0, 4);

        let differenceDt = convdateInterset.getTime() - convloanInterest.getTime();

        let howManyDays = differenceDt/(1000 * 3600 * 24);
        
        //Average 30 days/month
        if(periodDetermination == "Average 30 days/month" && frequency == "Monthly")
        {
            let calc1 = amount * (interest / 100)
            let calc2 = howManyDays / 30
            let finalVal = calc1 * calc2
            let roundOff = decimalInd == "yes" ? Math.round(finalVal).toFixed(2) : Math.round(finalVal);
            return roundOff;
        }
        else if(periodDetermination == "Exact Date" && frequency == "Monthly")
        {//Exact Date
            let calc1 = amount * (interest / 100)
            let newMonth = this.getNoDaysByMonth(monthVal);
            let calc2 = howManyDays / newMonth;
            let finalVal = calc1 * calc2
            let roundOff = decimalInd == "yes" ? Math.round(finalVal).toFixed(2) : Math.round(finalVal);
            return roundOff;
        }
        else if(periodDetermination == "Normal Year" && frequency == "Annual")
        {
            let calc1 = amount * (interest / 100)
            let calc2 = howManyDays / 365
            let finalVal = calc1 * calc2
            let roundOff = decimalInd == "yes" ? Math.round(finalVal).toFixed(2) : Math.round(finalVal);
            return roundOff;
        }
        else if(periodDetermination == "Leap Year" && frequency == "Annual")
        {
            let leapYearVal : any = 365;
            if(yearVal % 4 === 0 )
            {
                leapYearVal = 366;
            }
            let calc1 = amount * (interest / 100)
            let calc2 = howManyDays / leapYearVal;
            let finalVal = calc1 * calc2
            let roundOff = decimalInd == "yes" ? Math.round(finalVal).toFixed(2) : Math.round(finalVal);
            return roundOff;
        }
    }

    private getNoDaysByMonth(month)
    {
        if(month == "02")
        {
            return 28;
        }
        else if(month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12")
        {
            return 31;
        }
        else if(month == "04" || month == "06" || month == "09" || month == "11")
        {
            return 30;
        }
    }

    private calculateInterestIfLapsed(loanAmount: any, interest: any, currencyObj, selectedCurrency)
    {
        let calc1 = loanAmount * (interest / 100);

        let decimalInd : any;
        for(let item in currencyObj) 
        {
            if(selectedCurrency == currencyObj[item].codeVal)
            {
                decimalInd = currencyObj[item].detail2
                break;
            }
        }

        return decimalInd == "yes" ? Math.round(calc1).toFixed(2) : Math.round(calc1);
    }

    private calculateProrateIfLapsed(loanAmount: any, interest: any, currencyObj, selectedCurrency, loanDueDate, uiCalculationDate, divisor: any)
    {
        
        let decimalInd : any;
        for(let item in currencyObj) 
        {
            if(selectedCurrency == currencyObj[item].codeVal)
            {
                decimalInd = currencyObj[item].detail2
                break;
            }
        }

        let calc1 = loanAmount * (interest / 100);

        var dateInterset=dateFormat(new Date(uiCalculationDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convdateInterset = new Date(dateInterset);

        var loanDueDateVal=dateFormat(new Date(loanDueDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convloanDueDateVal = new Date(loanDueDateVal);

        let differenceDt = convdateInterset.getTime() - convloanDueDateVal.getTime();

        let howManyDays = differenceDt/(1000 * 3600 * 24);
        let calc2 = howManyDays / divisor;
        let finalval = calc1 * calc2;

        return decimalInd == "yes" ? Math.round(finalval).toFixed(2) : Math.round(finalval);
    }

    private getCalcInterstConfigTbl(data: any)
    {
        let interestCalcTableObj : any;

        let interestReceivableOutputReport: any;
                         let interestReceivableDeduct: any;
                         let interestReceivableCalc: any;

                         let proRatedOutputReport: any;
                         let proRatedDeduct: any;
                         let proRateCalc: any;

                         let interestPaidOutputReport: any;
                         let interestPaidDeduct: any;
                         let interestPaidCalc: any;

                         let repaymentOutputReport: any;
                         let repaymentDeduct: any;
                         let repaymentCalc: any;

                         let loanReceivableOutputReport: any;
                         let loanReceivableDeduct: any;
                         let loanReceivableCalc: any;

                         let outstandingOutputReport: any;
                         let outstandingDeduct: any;
                         let outstandingCalc: any;

                         for (let item in data.Items)
                         {
                            if(data.Items[item].typeOfTransaction == "Interest Receivable")
                            {
                                interestReceivableOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                interestReceivableDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                interestReceivableCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }

                            if(data.Items[item].typeOfTransaction == "Pro-rated Interest")
                            {   
                                proRatedOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                proRatedDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                proRateCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }

                            if(data.Items[item].typeOfTransaction == "Interest Paid")
                            {   
                                interestPaidOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                interestPaidDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                interestPaidCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }

                            if(data.Items[item].typeOfTransaction == "Loan Repayment")
                            {   
                                repaymentOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                repaymentDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                repaymentCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }

                            if(data.Items[item].typeOfTransaction == "Loan Receivable")
                            {   
                                loanReceivableOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                loanReceivableDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                loanReceivableCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }

                            if(data.Items[item].typeOfTransaction == "Previous outstanding balance")
                            {   
                                outstandingOutputReport = data.Items[item].reportOutput == "Include" ? "true" : "false";
                                outstandingDeduct = data.Items[item].addDeductAction == "Add" ? "Add" : "Deduct";
                                outstandingCalc = data.Items[item].interestCalculation == "Include" ? "true" : "false";
                            }
                        }

                        interestCalcTableObj = {
                            interestReceivableOutputReport : interestReceivableOutputReport,
                            interestReceivableDeduct : interestReceivableDeduct,
                            interestReceivableCalc : interestReceivableCalc,
                            proRatedOutputReport: proRatedOutputReport,
                            proRatedDeduct: proRatedDeduct, 
                            proRateCalc : proRateCalc,
                            interestPaidOutputReport : interestPaidOutputReport,
                            interestPaidDeduct: interestPaidDeduct,
                            interestPaidCalc : interestPaidCalc,
                            repaymentOutputReport : repaymentOutputReport,
                            repaymentDeduct : repaymentDeduct,
                            repaymentCalc : repaymentCalc,
                            loanReceivableOutputReport : loanReceivableOutputReport,
                            loanReceivableDeduct : loanReceivableDeduct,
                            loanReceivableCalc : loanReceivableCalc,
                            outstandingOutputReport : outstandingOutputReport,
                            outstandingDeduct : outstandingDeduct,
                            outstandingCalc : outstandingCalc
                        }

                        return interestCalcTableObj;
    }

    private checkOneYearPost(loanReleaseDt: any, uiCalculationDate)
    {
        var uiCalcDateVal=dateFormat(new Date(uiCalculationDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convuiCalcDateVal = new Date(uiCalcDateVal);

        var loanReleaseDtVal=dateFormat(new Date(loanReleaseDt).toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd");
        let convloanReleaseDtVal = new Date(loanReleaseDtVal);

        let differenceDt = convuiCalcDateVal.getTime() - convloanReleaseDtVal.getTime();
        let howManyDays = differenceDt/(1000 * 3600 * 24);
        if(howManyDays >= 365)
        {
            return true;
        }
        else {
            return false;
        }
    }

    public calculateBaseAmount(interestCalcTableObj: any, existingRecord:any)
    {
        let totalBased: any = 0;

        for(let item in existingRecord)
        {
            if(existingRecord[item].remarksVal == "Loan Receivable")
            {
                if(interestCalcTableObj.loanReceivableCalc == "true")
                {
                    totalBased = interestCalcTableObj.loanReceivableDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }

            if(existingRecord[item].remarksVal == "Interest Receivable")
            {
                if(interestCalcTableObj.interestReceivableCalc == "true")
                {
                    totalBased = interestCalcTableObj.interestReceivableDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }

            if(existingRecord[item].remarksVal == "Interest Paid")
            {
                if(interestCalcTableObj.interestPaidCalc == "true")
                {
                    totalBased = interestCalcTableObj.interestPaidDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }

            if(existingRecord[item].remarksVal == "Loan Repayment")
            {
                if(interestCalcTableObj.repaymentCalc == "true")
                {
                    totalBased = interestCalcTableObj.repaymentDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }

            
            if(existingRecord[item].remarksVal == "Previous outstanding balance")
            {
                if(interestCalcTableObj.outstandingCalc == "true")
                {
                    totalBased = interestCalcTableObj.outstandingDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }

            if(existingRecord[item].remarksVal == "Pro-rated Interest")
            {
                if(interestCalcTableObj.proRateCalc == "true")
                {
                    totalBased = interestCalcTableObj.proRatedDeduct == "Add" ? totalBased + Number(existingRecord[item].amountVal) : totalBased - Number(existingRecord[item].amountVal);
                }
            }
        }

        return totalBased;
    }


    public generateInterestCalcReport(objData: any) : Observable<any> {
        let loanObj = [];
        let companyOjb = [];
        let allObj = [];
        let filterAppCode : any;
        let interestSchemeObj: any;
        let currencyObj: any;
        let interestDueDate: any;
        let interestCalculationDate: any;
        let calculatedInterest: any;
        let hasExpired: any;
        let returnCalObj = [];
        let currencyExcelVal: any;
        let totalVal: any = 0;
        let interestCalcTableObj : any;
        let existingPastLoanDue: any = false;
        let isOverYearAnnualIndicator : any = false;
        let basedAmount: any;
        return Observable.create(async (observer) => {

               interestCalculationDate =  dateFormat(objData.data.calcDate, "yyyy-mm-dd").toString();
               let queryParams = this.reportParams.getLoanAppByCompanyByStatus(objData.data.company.code);
               let interestSchemParams = this.configParams.getConfigByName("interestscheme");
               let currencyParams = this.configParams.getConfigByName("currency");
               let interestCalTable = this.configParams.getInterestCalculationTbl();
               await this.loanApplicationDataService.executequeryDataServicePromise(queryParams).then(
                   (data) => {
                       if(data.Count >0)
                       {
                           for (let companyRes in data.Items)
                           {
                               loanObj.push(data.Items[companyRes])
                           }
                       }
                   }
               )

               await this.loanApplicationDataService.executequeryDataServicePromise(interestSchemParams).then(
                (data) => {
                    interestSchemeObj = data.Items;
                })

                await this.loanApplicationDataService.executequeryDataServicePromise(currencyParams).then(
                    (data) => {
                        currencyObj =  data.Items;
                    })

                await this.loanApplicationDataService.executequeryScanServicePromise(interestCalTable).then(
                        (data) => {
                         
                        interestCalcTableObj = this.getCalcInterstConfigTbl(data);
                })
           if(objData.data.applicantCode == "")
           {
               allObj = loanObj;
           }

           //filter applicant code
           if(objData.data.applicantCode != "")
           {
               console.log("with applicant")
               filterAppCode = this.loanLogic.filterApplicantCode(loanObj, objData.data);
               if(filterAppCode.length > 0)
               {
                   allObj = new Array();
                   allObj = filterAppCode;
               }
               else {
                   let retObject = []
                   observer.next(retObject);
                   observer.complete();
               }      
           }

           
           allObj = allObj.filter((value, index, self) =>
                  index === self.findIndex((t) => (
                  t.loankey === value.loankey
             ))
           )


           for (let item in allObj)
           {
            // console.log("allObj", allObj[item])
            let withExistingInterestRec: any = false;
            // let withInterestRec: any = false;
            let prevcalculatedInterest: any;
            let newRemarks: any;
            let isProrated: any = false;
            let isLoanDueindicator : any = false;

                isLoanDueindicator = this.isLoanDueDatePeriod(allObj[item].promisorryLoanPeriodYear,allObj[item].promisorryLoanPeriodMonth,allObj[item].promisorryLoanPeriodDay,allObj[item].LRloanReleaseDt,objData.data.calcDate);
            
                if(objData.data.loanDueIndicator == false)
                {
                    if(isLoanDueindicator)
                    {
                        let retVal = {
                            message: "loanDue"
                        }
                        observer.next(retVal);
                        observer.complete();
                    }
                }

            
                let interestDueSchemeObj = this.calculateInterestDueDate(allObj[item].LRloanReleaseDt, interestSchemeObj, allObj[item].promissoryScheme, 
                    allObj[item].promisorryLoanPeriodYear,allObj[item].promisorryLoanPeriodMonth,allObj[item].promisorryLoanPeriodDay);
                interestDueDate = interestDueSchemeObj.interestDueDate;
                

                // if(hasExpired == true)
                // {
                    let existingRecord : any;
                    let getAllReport = this.reportParams.getAllLoanReceiveDataByLoanKey(allObj[item].loankey);
                    await this.loanApplicationDataService.executequeryDataServicePromise(getAllReport).then(
                        (data) => {
                            if(data.Count > 0)
                            {
                                existingRecord = data.Items;
                                let amountVal: any;
                                for(let exist in data.Items)
                                {
                                    if(data.Items[exist].remarksVal == "Pro-rated Interest" && data.Items[exist].isLastIndicator == "1")
                                    {
                                        existingPastLoanDue = true;
                                        prevcalculatedInterest = data.Items[exist].calculatedInterest;
                                        let checkPrevLoan = this.calculateInterestDueDate(data.Items[exist].interestDueDate, interestSchemeObj, allObj[item].promissoryScheme,
                                            allObj[item].promisorryLoanPeriodYear,allObj[item].promisorryLoanPeriodMonth,allObj[item].promisorryLoanPeriodDay);
                                        interestDueDate = checkPrevLoan.interestDueDate;

                                        let proRatedObj = this.getReturnValue(allObj[item],data.Items[exist].interestCalculationDate,data.Items[exist].interestDueDate,data.Items[exist].calculatedInterest,data.Items[exist].remarksVal, interestCalcTableObj, "",  data.Items[exist].amountVal, "false")
                                        returnCalObj.push(proRatedObj)
                                    }
                                    if(data.Items[exist].remarksVal == "Interest Receivable")
                                    {
                                        withExistingInterestRec = true;
                                        let interestReceivableObj = this.getReturnValue(allObj[item],data.Items[exist].interestCalculationDate,data.Items[exist].interestDueDate,data.Items[exist].calculatedInterest,data.Items[exist].remarksVal, interestCalcTableObj, "",  data.Items[exist].amountVal, "false")
                                        returnCalObj.push(interestReceivableObj)
                                    }

                                    if(data.Items[exist].remarksVal == "Loan Receivable")
                                    {
                                        amountVal = data.Items[exist].amountVal;

                                        //add loan receivable in the return obj
                                        let loanReceivableObj = this.getReturnValue(allObj[item],"","", "",data.Items[exist].remarksVal, interestCalcTableObj, "",  data.Items[exist].amountVal, "false")
                                        returnCalObj.push(loanReceivableObj)
                                    }

                                    if(data.Items[exist].remarksVal == "Interest Paid")
                                    {
                                        //add interest paid in the return obj
                                        let loanReceivableObj = this.getReturnValue(allObj[item],"","", "",data.Items[exist].remarksVal, interestCalcTableObj, "",  "-" + data.Items[exist].amountVal, "false")
                                        returnCalObj.push(loanReceivableObj)
                                    }
                                }
                                // console.log("withExistingInterestRec", withExistingInterestRec)
                                if(withExistingInterestRec)
                                {
                                    basedAmount = this.calculateBaseAmount(interestCalcTableObj,existingRecord)
                                }
                                else {
                                    basedAmount = amountVal;
                                }
                                
                            } 
                            else {
                                existingPastLoanDue = false;
                                interestDueDate = interestDueSchemeObj.interestDueDate;
                            } 
                        })
                // }
                hasExpired = this.hasExpired(interestDueDate,objData.data.calcDate);

                if(hasExpired == true && isLoanDueindicator == false)
                {
                    //if frequency is annual and determination normal year 
                    if((interestDueSchemeObj.schemeVal == "Annual" && interestDueSchemeObj.periodDetermination == "Normal Year") || interestDueSchemeObj.schemeVal == "Annual" && interestDueSchemeObj.periodDetermination == "Leap Year")
                    {
                        isOverYearAnnualIndicator = this.checkOneYearPost(allObj[item].LRloanReleaseDt,objData.data.calcDate)
                    }
                    
                }
                // console.log("basedAmount", basedAmount)
                // console.log("allObj[item].LRloanReleaseDt", allObj[item].LRloanReleaseDt)
                // console.log("interestCalculationDate", interestCalculationDate)
                // console.log("interestDueDate", interestDueDate)
                // console.log("isLoanDueindicator", isLoanDueindicator)
                // console.log("interestDueSchemeObj.isProRata", interestDueSchemeObj.isProRata)
                // console.log("hasExpired", hasExpired)


                if((objData.data.loanDueIndVal == "yes" || (objData.data.loanDueIndVal == "no" && !isLoanDueindicator)))
                {

                    if(existingPastLoanDue == true)
                    {
                            newRemarks = "Reversed Pro-rated Interest";
                            let calcInterestNewObj = this.getReturnValue(allObj[item],interestCalculationDate,interestDueDate, prevcalculatedInterest,newRemarks, interestCalcTableObj, "",  prevcalculatedInterest, "true")
                            returnCalObj.push(calcInterestNewObj)
                    }
                    
                    if(hasExpired == false && interestDueSchemeObj.isProRata == true)
                    {
                        newRemarks = "Pro-rated Interest";
                        let proRateValue = this.calculateProRateInterestByLoanReleaseDt(interestDueSchemeObj.schemeVal, interestDueSchemeObj.periodDetermination, interestDueSchemeObj.periodDeterminationDay, allObj[item].LRloanReleaseDt,objData.data.calcDate,
                            basedAmount, allObj[item].promissoryInterestRate, currencyObj, allObj[item].promissoryCurrency, interestDueDate)

                        let calcInterestNewObj = this.getReturnValue(allObj[item],interestCalculationDate,interestDueDate, proRateValue,newRemarks, interestCalcTableObj, "", proRateValue, "true")
                        returnCalObj.push(calcInterestNewObj)
                    }

                    if(hasExpired == true) 
                    {
                        // if(withExistingInterestRec == false) // not for over the year only
                        // {
                            newRemarks = "Interest Receivable";
                            let calInterestVal = this.calculateInterestIfLapsed(basedAmount, allObj[item].promissoryInterestRate, currencyObj, allObj[item].promissoryCurrency)
                            let calcInterestNewObj = this.getReturnValue(allObj[item],interestCalculationDate,interestDueDate, calInterestVal,newRemarks, interestCalcTableObj, "true", calInterestVal, "true")
                            returnCalObj.push(calcInterestNewObj)
                        // }
                        
                        if(isOverYearAnnualIndicator)
                        {
                            if(interestDueSchemeObj.isProRata == true)
                            {
                                newRemarks = "Pro-rated Interest";
                                let proRatedVal = this.calculateProrateIfLapsed(basedAmount, allObj[item].promissoryInterestRate, currencyObj, allObj[item].promissoryCurrency, interestDueDate,interestCalculationDate, Number(365))
                                let proRatedValIfElapsed = this.getReturnValue(allObj[item],interestCalculationDate,interestDueDate, proRatedVal,newRemarks, interestCalcTableObj, isOverYearAnnualIndicator, proRatedVal, "true")
                                returnCalObj.push(proRatedValIfElapsed)
                            }
                            
                        }
                        else {
                            if(interestDueSchemeObj.isProRata == true)
                            {
                                newRemarks = "Pro-rated Interest";
                            let proRatedVal = this.calculateProrateIfLapsed(basedAmount, allObj[item].promissoryInterestRate, currencyObj, allObj[item].promissoryCurrency, interestDueDate,interestCalculationDate, Number(30))
                            let proRatedValIfElapsed = this.getReturnValue(allObj[item],interestCalculationDate,interestDueDate, proRatedVal,newRemarks, interestCalcTableObj, "", proRatedVal, "true")
                            returnCalObj.push(proRatedValIfElapsed)
                            }
                            
                        }
                        

                    }

                }
                   
           }

           if(returnCalObj.length > 0 )
           {   
        
               var dateToday=dateFormat(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }), "yyyy-mm-dd h:MM:ss TT");

               let retval = {
                   report : returnCalObj,
                   title: "Interest Calculation Report",
                   generatedDate: dateToday,
                   message: "success"
               }
               observer.next(retval);
               observer.complete();
           }
           else {
                   let retObject = []
                   observer.next(retObject);
                   observer.complete();
           
           }

           
            observer.next("success test");
            observer.complete();
           
        })

    }

    private getReturnValue(allObj,interestCalculationDate,interestDueDate, calculatedInterest,newRemarks, interestCalcTableObj, overYearInd: any, amountVal: any, isForInsertion: any)
    {
        let calcInterestNewObj = {
            companyCode: allObj.addtlCompany,
            company: allObj.addtlCompanyValue,
            applicantCode: allObj.applicantFirstNm,
            applicantName: allObj.applicantLastNm,
            coMakerCode: allObj.comakerFirstNm,
            coMakerName: allObj.comakerLastNm,
            applicationDate: dateFormat(allObj.applicationDate, "yyyy-mm-dd"),
            releaseDate: dateFormat(allObj.LRloanReleaseDt, "yyyy-mm-dd"),
            loanForm: allObj.docNumber,
            releasedBy: allObj.updatedBy,
            collectionGroup: allObj.addtlCollectionGroupValue,
            collectionAgency: allObj.addtlCollectionAgentValue,
            amount: amountVal,
            currency: allObj.promissoryCurrency,
            interestRate: allObj.promissoryInterestRate,
            interestSchemeCode: allObj.promissoryScheme,
            interestScheme: allObj.promissorySchemeValue,
            paymentTermCode: allObj.promissoryPaymentTerm,
            paymentTerm: allObj.promissoryPaymentTermValue,
            interestCalculationDate: interestCalculationDate,
            interestDueDate: interestDueDate,
            calculatedInterest: calculatedInterest,
            remarks: newRemarks,
            isInterestRecIncludeReport: interestCalcTableObj.interestReceivableOutputReport,
            isProratedIncludeReport: interestCalcTableObj.proRatedOutputReport,
            isInterestPaidIncludeReport:  interestCalcTableObj.interestPaidOutputReport,
            overYearIndForInterestReceivable: overYearInd == undefined || overYearInd == null ? "false" : overYearInd,
            loankey: allObj.loankey,
            addtlCollectionAgent: allObj.addtlCollectionAgent,
            addtlCollectionAgentValue: allObj.addtlCollectionAgentValue,
            addtlCollectionGroup: allObj.addtlCollectionGroup,
            addtlCollectionGroupValue: allObj.addtlCollectionGroupValue,
            isForInsertion: isForInsertion
        }

        return calcInterestNewObj;
    }

    public postInterestCalculationReport(objData: any) : Observable<any> {
        return Observable.create(async (observer) => {
            let updateObj = [];
            let uniqueLoanKey =  objData.data.filter((value, index, self) =>
                      index === self.findIndex((t) => (
                      t.loankey === value.loankey
                 ))
               )
           
            for(let item in uniqueLoanKey)
            {
                let getLastReport = this.reportParams.getLastLoanReceiveData(uniqueLoanKey[item].loankey);
                    await this.loanApplicationDataService.executequeryDataServicePromise(getLastReport).then(
                        (data) => {
                            if(data.Count > 0)
                            {
                                for(let item in data.Items)
                                {
                                    let newObj = {
                                        id: data.Items[item].id,
                                        interestDueDate: data.Items[item].interestDueDate,
                                        loankey: data.Items[item].loankey
                                    }
                                    updateObj.push(newObj);
                                }
                            }
             })}

             for(let item in objData.data)
             {
                
                let insertReport = this.reportParams.insertIntoReceivableReportTbl(objData.data[item]);
                await this.loanApplicationDataService.executequeryInsertServicePromise(insertReport).then(
                    (data) => {
                        // console.log("sucessful insert - loan charge table")
                    },
                    (error) => {
                        console.log("error insert - loan charge table")
                    }
                )
                // if(objData.data[item].remarks == "Interest Receivable")
                // {
                //     let updateLoanRecord = this.reportParams.updateLoanWithInterestReceivable(objData.data[item].loankey);
                //     await this.loanApplicationDataService.executequeryUpdateServicePromise(updateLoanRecord).then(
                //         (data) => {
                //             console.log("sucessful update - loan table")
                //         },
                //         (error) => {
                //             console.log("error insert - loan table")
                //         }
                //     )
                // }


             }

            for(let item in updateObj)
            {
                let updateLastInd = this.reportParams.updateLastIndicator(updateObj[item].id);
                await this.loanApplicationDataService.executequeryUpdateServicePromise(updateLastInd).then(
                    (data) => {
                    },
                    (error) => {
                        console.log("error insert - loan table")
                    }
                )
            }
            let retObj = {
                status: "success"
            }

            observer.next(retObj)
            observer.complete();

        })
    }

}