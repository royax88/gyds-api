/* Start
Description: 
for debugging purpose only. 
this will be disabled once deployed.
 */
export function loggingInfo(message:any, object?: any)
{
    let now = new Date();
    if(process.env['disabledInfoLogging'] == "true")
    {
        //do nothing
    }
    else{
        if(typeof object=="undefined" || object == null || object == '')
        {
            console.log(message, now);
        }
        else
        {
            console.log(""+message+": ", object, now);
        }
        
    }
}
/*END*/

/* Start
Description: 
 */
export function loggingInfoShow(message:any, object?: any)
{
    let now = new Date();
    if(typeof object == "undefined" || object == null || object == '')
        {
            console.log(message, now);
        }
        else
        {
            console.log(""+message+": ", object, now);
        }
}
/*END*/

/*START
Description: Logging for successful insert.
where fnxName = method name
      id = it may personnel number, peopley key, unique identifier for the inserted record
 */
export function logInsertSuccess(fnxName: any, id:any, params: any, user: any)
{
    let now = new Date(); //TODO: date should be in PH
    let obj = {
        action: "insert success",
        methodname: fnxName,
        id: id,
        params: params,
        requester: user,
        datettime: now
    }
    console.log(obj);
}
/*END*/

/*START
Description: Logging for successful update.
where fnxName = method name
      id = it may personnel number, peopley key, unique identifier for the inserted record
      transID = transaction ID of the record
 */
export function logUpdateSuccess(fnxName: any, id:any, transID: any, params:any, user: any)
{
    let now = new Date(); //TODO: date should be in PH
    let obj = {
        action: "update success",
        methodname: fnxName,
        id: id,
        transactionid: transID,
        params: params,
        requester: user,
        datettime: now
    }
    
    console.log(obj);
}
/*END*/


/*START
Description: Error log for SQL 
 */
export function errorLog(fnxName:any, id: any, params:any, error:any, user: any) 
{
    let errorMsg: any;
    let now = new Date(); 
    let errObj;
    
    if(typeof error.code != "undefined" || error.code != null || error.code != '')
    {
        errObj = {
            methodname: fnxName,
            identifier: id,
            params: params,
            errornm: error.name,
            errorcd: error.code,
            errormsg: error.message,
            requester: user,
            datettime: now
        }
    }
    else
    {
        errObj = {
            methodname: fnxName,
            identifier: id,
            params: params,
            requester: user,
            datettime: now
        }
    }

    console.error(errObj);
}

