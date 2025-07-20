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
            console.log("event", event)
            
            // Handle different event structures for local vs production
            if(process.env['localenv']==="true" && event.body) {
                this.objData = event.body;
            } else {
                this.objData = event;
            }

            // Validate that we have a DynamoDB event structure
            if (!this.objData || !this.objData.Records || !Array.isArray(this.objData.Records) || this.objData.Records.length === 0) {
                console.error("Invalid DynamoDB event structure", this.objData);
                return this.triggerBatchBusinessService.returnError();
            }

            let record = this.objData.Records[0];
            
            // Validate record structure
            if (!record.eventName || !record.eventSource || !record.dynamodb || !record.dynamodb.NewImage) {
                console.error("Invalid DynamoDB record structure", record);
                return this.triggerBatchBusinessService.returnError();
            }

            let eventNm = record.eventName;
            let eventSrc = record.eventSource;
            let eventStatus = record.dynamodb.NewImage.statusVal;
            let eventObj = record.dynamodb.NewImage;

            if(eventNm == "INSERT" || eventNm == "MODIFY")
            {
                if(eventSrc == "aws:dynamodb" && eventStatus && eventStatus.S == "Released")
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
            console.error("Error processing DynamoDB event:", error);
            return this.triggerBatchBusinessService.returnError();
        }
        
        
    }
    

}
