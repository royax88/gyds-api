var nosql = require("aws-sdk");
var docClient = new nosql.DynamoDB.DocumentClient({ region: process.env['region'] });  
import { Observable } from 'rxjs/Observable';

export class DynamoDBDataService {

    constructor() {
    }
 
    public executequeryDataService = function (params: any): Observable<any> {
        return Observable.create((observer) => {
            this.executequery(params, function (err, data) {
                if (err) {
                    observer.error(err);
                }
                else {
                    observer.next(data);
                    observer.complete();
                }
            });
        });
    }

    public executequery = function (nosqlparam: any, callback) {

        docClient.query(nosqlparam, function (err, data) {
            if (err) {
                console.log("actual error", err);
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });

    }
    public executescan = function (params: any): Observable<any> {
        logging.loggingInfo("execute executequeryDataService");
        return Observable.create((observer) => {

            docClient.scan(params, function (err, data) {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(data);
                    observer.complete();
                }
            })

        })
        
    }

    public executeupdate = function (params: any): Observable<any> {
        logging.loggingInfo("execute executequeryDataService");
        return Observable.create((observer) => {

            docClient.update(params, function (err, data) {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(data);
                    observer.complete();
                }
            })

        })
        
    }

    public executeUpdateCallback = function (nosqlparam: any, callback) {

        docClient.query(nosqlparam, function (err, data) {
            if (err) {
                console.log("actual error", err);
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });

    }

    public InsertData = function(param:any):Observable<any> {
        return Observable.create((observer) => {
            
            docClient.put(param, function(err, data) {
                if (err) {
                    observer.error(err);
                } else {
                  observer.next(data);
                  observer.complete();
                }
              });
        })

    }


}