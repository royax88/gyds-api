import { Observable } from 'rxjs/Observable';
import { ElectionPageModel } from '../models/ElectionPageModel';
import { ElectionPageBusinessService} from '../business-service/election-page-business-service';
import logging = require('common-logging');

export class ElectionPageService {

    private model;
    actioncd: any;
    id: any;
    private electionPageBusinessService = new ElectionPageBusinessService();

    constructor() {
        
    }

    public executeActions(event: any, decodedData: any): Observable<any> {
        // console.log("event", event);
        let object: any;
        if(process.env['localenv']==="true")
        {
            this.actioncd = event.body.actioncd;
            this.id = event.body.id;
            object = event.body;
        }
        else
        {
            this.actioncd = JSON.parse(event.body).actioncd;
            this.id = JSON.parse(event.body).id;
            object = JSON.parse(event.body);
        }
        console.log("action", this.actioncd)
        console.log("id", this.id)
        if(this.actioncd=='checkExistingElecRecord')
        {

            return this.electionPageBusinessService.checkExistingElecRecord(this.id, decodedData.email);
        }
        else if(this.actioncd=='getElectionResult')
        {

            return this.electionPageBusinessService.getElectionResult();
        }
        else if(this.actioncd=='insertElectionReult')
        {
            return this.electionPageBusinessService.insertElectionResult(this.id, decodedData.email, object);
        }
    }

}
