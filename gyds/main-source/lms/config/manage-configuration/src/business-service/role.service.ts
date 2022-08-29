import { Observable } from 'rxjs/Observable';
import {ManageConfigDataService} from '../data-service/manage-config-data-service';
import {RoleNoSQLParams} from '../business-service/roleNosqlparams';
export class RoleBusinessService {

    private manageConfigDataService = new ManageConfigDataService();
    private roleNoSqlParams = new RoleNoSQLParams();
    constructor() {

    }

    public getAllRole() : Observable<any> {
       
        let queryParams = this.roleNoSqlParams.getAllRole();
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

    public insertRoleTbl(obj: any) : Observable<any> {

        let roleCdParams = this.roleNoSqlParams.checkExistingRoleCd(obj.data.roleCd.toLowerCase());
        let roleNmParams = this.roleNoSqlParams.checkExistingRoleNm(obj.data.roleNm.toLowerCase());
        let insertParams = this.roleNoSqlParams.insertIntoRoleTbl(obj);
        return Observable.create((observer) => {

            this.manageConfigDataService.executequeryDataService(roleCdParams).subscribe(
                (data)=> {
                    if(data.Count > 0)
                    {
                        let msg = {
                            message: "existingRoleCd"
                        }
                        observer.next(msg);
                        observer.complete();
                    }
                    else 
                    {
                        this.manageConfigDataService.executequeryDataService(roleNmParams).subscribe(
                            (roleNmData) => {
                                if(roleNmData.Count > 0)
                                {
                                    let msg = {
                                        message: "existingRolNm"
                                    }
                                    observer.next(msg);
                                    observer.complete();
                                }
                                else {
                                    this.manageConfigDataService.InsertData(insertParams).subscribe(
                                        (data) => {
                                            let msg = {
                                                message: "createdRole"
                                            }
                                            observer.next(msg);
                                            observer.complete();
                                            
                                        },
                                        (error) => {
                                            console.log("errr", error)
                                            observer.error(error);
                                        });
                                }
                            },
                            (error) => {
                                observer.error(error)
                            }
                        )
                    }
                },
                (error) => {
                    observer.error(error)
                }
            )

        })

    }

}