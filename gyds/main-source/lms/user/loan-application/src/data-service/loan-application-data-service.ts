var nosql = require("aws-sdk");
var docClient = new nosql.DynamoDB.DocumentClient({ region: process.env['region'] });  
import { Observable } from 'rxjs/Observable';

export class LoanApplicationDataService {

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

    public executequeryDataServicePromise(params: any): Promise<any>
    {
        return new Promise(
        (resolve, reject) => {
            docClient.query(params, function (err, data) {
                if (err) {
                }
                else {
                    resolve(data)
                }
            });
        }
            
        )
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

    public executequeryAsync = async function (nosqlparam: any) {

        const promise = new Promise(resolve => 
            docClient.query(nosqlparam, function (err, data) {
                resolve(data);
            })
            );

        const result = await promise;
        return result;

    }

    public executequeryPromise = function  (nosqlparam: any) {

        return new Promise<any>(resolve => {
             docClient.query(nosqlparam, function (err, data) {
              resolve(data);
            });
        })

    }

    public executescanDS = function (params: any): Observable<any> {
        return Observable.create((observer) => {

            this.executescan(params, function (err, data) {
                if (err) {
                    observer.error(err);
                }
                else {
                    observer.next(data);
                    observer.complete();
                }
            });

        })
        
    }

    public executescan = function (nosqlparam: any, callback) {

        docClient.scan(nosqlparam, function (err, data) {
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
                console.log("insert", data)
                if (err) {
                    observer.error(err);
                } else {
                  observer.next(data);
                  observer.complete();
                }
              });
        })

    }
    
    
    public executeupdate = function (nosqlparam: any) : Observable<any> {

        return Observable.create((observer)=> {
            
        docClient.update(nosqlparam, function (err, data) {
            if (err) {
                observer.error(err)
            }
            else {
                observer.next(data);
                observer.complete();
            }
        });
        })

    }

    // public executeupdate = function (nosqlparam: any, callback) {
    //     docClient.update(nosqlparam, function (err, data) {
    //         if (err) {
    //             callback(err, null);
    //         }
    //         else {
    //             callback(null, data);
    //         }
    //     });
    // }


}