
var testevent = require("../config/event.json");
var testcontext = require("../config/context.json");
var yaml = require("js-yaml");
var fs = require("fs");
var e = yaml.load(fs.readFileSync("./serverless.config.localdev.yml"));

let setLocalVariable = function(x:any, y:any) {
    x.forEach(element => {
          process.env[element] = y[element];
    });
};
let LocalVariableSet  = ['eso_iss' ,'eso_certFileName' , 'eso_scopes', 'eso_disableLocalSecurity' ,'wl_msg'] ; 

setLocalVariable(LocalVariableSet , e); 

var handler = require('./index')['handler'];

var aa = process.env ; 
//handler(testevent, context);


handler(testevent, null, function(error, result){

            if (error) {
                console.log('fail: ' + error); 
            } else {
                console.log('succeed: ' + JSON.stringify(result));            
            }
});

 

