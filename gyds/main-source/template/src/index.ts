
import {HomePageService, getHomePages } from './services';
var fs = require("fs");
import logging = require('common-logging');

var versionlog = JSON.parse(fs.readFileSync('version.json', 'utf8'));
let config: any;
let check: any;


export function handler(event: any, context: any, callback: any) {
     logging.loggingInfo("event:", event);
     function responseCallback(err, data) {
            callback(err, data);
     }


    getHomePages(event, new HomePageService(), responseCallback);

   
    
}

