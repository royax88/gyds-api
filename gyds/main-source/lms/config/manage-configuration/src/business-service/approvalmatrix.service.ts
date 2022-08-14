import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {MatrixNoSQLParams} from './matrixNosqlparams';
import {AddUserNoSQLParams} from '../../../../admin/add-new-user/src/business-service/nosqlparams'
export class ApprovalMatrixPartnerBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private noparams = new MatrixNoSQLParams();
    private addUserParams = new AddUserNoSQLParams();
    constructor() {

    }

    // public insertBusinessPartner(obj: any) : Observable<any> {

    //     let queryParams = this.noparams.insertIntoBusinessPartnerTbl(obj);
    //     return Observable.create((observer) => {
    //         this.manageConfigDataService.InsertData(queryParams).subscribe(
    //             (data) => {
                    
    //                 let msg = {
    //                     message: "createdBusinessPartner"
    //                 }
    //                 observer.next(msg);
    //                 observer.complete();
                    
    //             },
    //             (error) => {
    //                 console.log("errr", error)
    //                 observer.error(error);
    //             });
    //     })

    // }

    public updateMatrixTbl(obj: any) : Observable<any> {

        let queryParams = this.noparams.updateMatrixtbl(obj);
        return Observable.create((observer) => {
            this.manageConfigDataService.executeupdate(queryParams).subscribe(
                (data) => {
                    
                    let msg = {
                        message: "updatedMatrixTable"
                    }
                    observer.next(msg);
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


    public getAllMatrix() : Observable<any> {

       
        let queryParams = this.noparams.getAllMatrix();
       
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {             
                    observer.next(data)
                    observer.complete();
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }


    public getAllMatrixByAccess() : Observable<any> {

        let queryParams = this.addUserParams.getAllLMSRole();
       
        return Observable.create((observer) => {

            this.manageConfigDataService.executescanDS(queryParams).subscribe(
                (data) => {       
                    let processorObj = [];
                    let reviewerObj = [];
                    let approverObj = [];
                    let releaseObj = [];
                    
                    if(data.Count > 0)
                    {
                        for(let item in data.Items)
                        {
                            console.log("item", data.Items[item])
                            for(let val in data.Items[item].lmsrole)
                            {
                                if(data.Items[item].lmsrole[val]=="processor")
                                {
                                    let tempObj = {
                                        code: data.Items[item].username,
                                        value: data.Items[item].fullNm
                                    }
                                    processorObj.push(tempObj)
                                }

                                if(data.Items[item].lmsrole[val]=="approver")
                                {
                                    let tempObj = {
                                        code: data.Items[item].username,
                                        value: data.Items[item].fullNm
                                    }
                                    reviewerObj.push(tempObj)
                                }

                                if(data.Items[item].lmsrole[val]=="reviewer")
                                {
                                    let tempObj = {
                                        code: data.Items[item].username,
                                        value: data.Items[item].fullNm
                                    }
                                    approverObj.push(tempObj)
                                }

                                if(data.Items[item].lmsrole[val]=="releaseOfficer")
                                {
                                    let tempObj = {
                                        code: data.Items[item].username,
                                        value: data.Items[item].fullNm
                                    }
                                    releaseObj.push(tempObj)
                                }
                                
                            }
                        }
                        let newObj = {
                            processorObj : processorObj,
                            reviewerObj : reviewerObj,
                            approverObj : approverObj,
                            releaseObj : releaseObj
                        }
                        observer.next(newObj)
                        observer.complete();

                    }  
                   
                    
                },
                (error) => {
                    console.log("errr", error)
                    observer.error(error);
                });
        })

    }

}