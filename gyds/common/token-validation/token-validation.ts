
var admin = require("firebase-admin");
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp(
  {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://decatisacebu.firebaseio.com"
  }
);

export async function VerifyToken(idToken, callback) {
    //console.log("idToken", idToken)
    let jwtHeader : any;
    if(process.env['localenv'] == "true")
    {
      jwtHeader = idToken.params.headers.Authorization.split(" ");
    }
    else 
    {
      jwtHeader = idToken.headers.Authorization.split(" ");
    }
     
    admin.auth().verifyIdToken(jwtHeader[1])
    .then(function(decodedToken) {
      
      callback(null, decodedToken);
      // ...
    }).catch(function(error) {
      if(error.errorInfo.code=="auth/id-token-expired")
      {
        let response:any;
        response = 401;
        callback(error, null);
      }
      callback(error, null);
    });

    // callback(null, "success");
   
}

export interface ValidationResult {
    err? : any,
    isValid: boolean
    decoded: any
}

// var app = admin.initializeApp();