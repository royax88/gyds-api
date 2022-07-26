
import {ElectionPageService, getElectionPages } from './services';
var fs = require("fs");
import {VerifyToken} from '../../../common/token-validation/token-validation';

var versionlog = JSON.parse(fs.readFileSync('version.json', 'utf8'));
let config: any;
let check: any;


export function handler(event: any, context: any, callback: any) {
     function responseCallback(err, data) {
            callback(err, data);
     }

     VerifyToken(event, ((err, data) => {
       if(data)
       {
              // console.log("data", data)
              getElectionPages(event,data, new ElectionPageService(), responseCallback);
       }
       else
       {
              let statuscd: any;
              let errorTypeVal: any;
              if(err.errorInfo.code=="auth/id-token-expired")
              {
                     statuscd = 401;
                     errorTypeVal = "id-token-expired";
              }
              else {
                     statuscd = 500;
                     errorTypeVal = "InternalServerError";
              }

              // var errorObj = {
              //               statusCode : statuscd,           
              //               headers: {
              //                      "Content-Type": "application/json",
              //                          "Access-Control-Allow-Origin": "*",
              //                          "Access-Control-Allow-Headers": "Content-Type",
              //                          "Referrer-Policy": "origin",
              //                          "X-Xss-Protection": "1; mode=block",
              //                          "X-Content-Type-Options": "nosniff",
              //                          "X-Frame-Options": "SAMEORIGIN",
              //                          "Cache-Control": "no-store",
              //                          "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
              //                  },
              //               body: err,                 
              //               isBase64Encoded:  false  
              // }

              // var myErrorObj = {
              //        name : errorTypeVal,
              //        statusCode: statuscd,
              //        message : "An unknown error has occurred. Please try again.",
              //        headers: {
              //               "Content-Type": "application/json",
              //                   "Access-Control-Allow-Origin": "*",
              //                   "Access-Control-Allow-Headers": "Content-Type",
              //                   "Referrer-Policy": "origin",
              //                   "X-Xss-Protection": "1; mode=block",
              //                   "X-Content-Type-Options": "nosniff",
              //                   "X-Frame-Options": "SAMEORIGIN",
              //                   "Cache-Control": "no-store",
              //                   "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
              //           }
              //    }

              let error = {
                     statusCode: statuscd,
                     headers: { 
                     "Access-Control-Allow-Origin": "*" }, // not sure here
                     body: err
                 }
            callback(err, null);
       }
  }));


}

