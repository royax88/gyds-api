import { Observable } from 'rxjs/Observable';
import {AuditDataService} from './audit.dataservice';
import {AuditNoSQLParams} from './nosqlparams';

export class AuditBusinessService {

    private auditDataService = new AuditDataService();
    private auditNoSQLParams = new AuditNoSQLParams();

    constructor() {

    }

    public insertIntoAuditTbl(loankey,status, action,createdBy,createdDate) : Observable<any> {

        let queryParams = this.auditNoSQLParams.insertIntoAudit(loankey,status, action,createdBy,createdDate);
        return Observable.create((observer) => {
            this.auditDataService.InsertData(queryParams).subscribe(
                (data) => {
                
                    let msg = {
                            message: "NewAudit"
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


}