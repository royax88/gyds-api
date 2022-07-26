var slsServiceRegister = require('./slsServiceRegister')

const SERVICE_DISCOVERY_AWS_PROFILE = "L2D"
const SERVICE_DISCOVERY_AWS_REGION = "eu-west-1"

const SERVICE_DISCOVERY_TABLE_NAME = "2731.Dev.ServiceData"
const SERVICE_DISCOVERY_KEY_NAME = "2731.Dev.ServiceData.Endpoint.Dev"



var SLS_ENDPOINT;

function processOutput (data) {
    console.log('Received Stack Output (stage = localdev)', data)
    slsServiceRegister.processOutput(data, SERVICE_DISCOVERY_TABLE_NAME, SERVICE_DISCOVERY_KEY_NAME, SERVICE_DISCOVERY_AWS_PROFILE, SERVICE_DISCOVERY_AWS_REGION);
}

module.exports = { processOutput }
