import { Observable } from 'rxjs/Observable';
import { TriggerBatchBusinessService} from '../business-service/trigger-batch-business-service';

export class TriggerBatchService {

    private model;
    actioncd: any;
    username: any;
    objData: any;
    identifier: any;
    private triggerBatchBusinessService = new TriggerBatchBusinessService();

    constructor() {
        
    }

    public executeActions(event: any): Observable<any> {
        let object: any;
        try {
            console.log("event",event)
            if(process.env['localenv']==="true")
            {
                this.objData = event.body;
            }
            else
            {
                this.objData = event;
            
            }
            let eventNm = this.objData.Records[0].eventName;
            let eventSrc = this.objData.Records[0].eventSource;
            let eventStatus = this.objData.Records[0].dynamodb.NewImage.statusVal;
            let eventObj = this.objData.Records[0].dynamodb.NewImage;

            if(eventNm == "INSERT" || eventNm == "MODIFY")
            {
                if(eventSrc == "aws:dynamodb" && eventStatus.S == "Released")
                {
                    return this.triggerBatchBusinessService.processLoanReleaestransaction(eventObj);
                }
                else {
                    return this.triggerBatchBusinessService.returnSkip();
                }
            }
            else {
                return this.triggerBatchBusinessService.returnSkip();
            }
        }
        catch(error)
        {
            return this.triggerBatchBusinessService.returnError();
        }
        
        
    }
    

}
