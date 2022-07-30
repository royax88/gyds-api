

export const manageConfig = (event, service, callback: any) => {
    service.executeActions(event).subscribe(
        data => { 
            let response: any;

            if(process.env['localenv']==="true")
            {
                response = data;
            }
            else
            {
                response = {
                    statusCode: 200,
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Content-Type",
                            "Referrer-Policy": "origin",
                            "X-Xss-Protection": "1; mode=block",
                            "X-Content-Type-Options": "nosniff",
                            "X-Frame-Options": "SAMEORIGIN",
                            "Cache-Control": "no-store",
                            "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
                    }
                };
            }
            

            callback(null, response)
        },
        error => callback(error)
    );
    
    
};
