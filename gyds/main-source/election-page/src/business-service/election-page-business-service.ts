import { Observable } from 'rxjs/Observable';
import {DynamoDBDataService} from '../data-service/election-page-data-service';
import {EventDemandNoSQLParams} from './nosqlparams';

export class ElectionPageBusinessService {

    private dynamoDBDataService = new DynamoDBDataService();
    private NoSQLParams = new EventDemandNoSQLParams();

    constructor() {

    }

    public checkExistingElecRecord(id: any, email: any) : Observable<any> {

        console.log("id", id)
        let queryParams = this.NoSQLParams.checkExistingRecord(id, email);
        return Observable.create((observer) => {
            this.dynamoDBDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    console.log("success", data)
                    observer.next(data.Items);
                    observer.complete();
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public getElectionResult() : Observable<any> {

        let queryParams = this.NoSQLParams.scanElectionResult();
        return Observable.create((observer) => {
            this.dynamoDBDataService.executescan(queryParams).subscribe(
                (data) => {
                    console.log("getElectionResult", data)
                    observer.next(data.Items);
                    observer.complete();
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

    public insertElectionResult(id: any, email: any, obj: any) : Observable<any> {

        let queryParams = this.NoSQLParams.checkExistingRecord(id, email);
        return Observable.create((observer) => {
            this.dynamoDBDataService.executequeryDataService(queryParams).subscribe(
                (data) => {
                    if(data.Count > 0)
                    {
                        observer.next("existing record. you can no longer vote.");
                        observer.complete();
                    } 
                    else 
                    {
                     
                       let insertParams = this.NoSQLParams.insertIntoMainElection(id, email, obj);
                       this.dynamoDBDataService.InsertData(insertParams).subscribe(
                        (insertedData) => { 
                            var keys = Object.keys(obj.data);
                            var last = keys[keys.length-1];
                            for(let item in obj.data)
                            {
                                let getElectedParams = this.NoSQLParams.getElected(obj.data[item]);
                                this.dynamoDBDataService.executequeryDataService(getElectedParams).subscribe((elecdata)=> {
                                    let newCount = Number(elecdata.Items[0].countVal) + 1;
                                    let updateParams = this.NoSQLParams.updateElectedRecord(obj.data[item], Number(newCount));
                                    this.dynamoDBDataService.executeupdate(updateParams).subscribe(
                                        data=>{
                                            if(item == last)
                                            {  
                                                observer.next(elecdata);
                                                observer.complete();
                                            }
                                        }, 
                                        error=> {
                                            observer.error(error);
                                        }
                                    )

                                },
                                (error)=> {
                                    observer.error(error);
                                })
                            }
                            

                        }, 
                        (error) => {
                            console.log("error insert")
                            observer.error(error);
                        }) 
                      
                    }
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

}