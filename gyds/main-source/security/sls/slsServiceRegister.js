var AWS = require("aws-sdk");

var SERVICE_DISCOVERY_TABLE_NAME;
var SERVICE_DISCOVERY_KEY_NAME;
var SLS_ENDPOINT;

module.exports =
{
  processOutput: function(data, serviceDiscoveryTableName, serviceDiscoveryKeyName, awsProfile, awsRegion)
  {
    var credentials = new AWS.SharedIniFileCredentials({profile: awsProfile});
    AWS.config.credentials = credentials;
    AWS.config.update({ region: awsRegion });

    SLS_ENDPOINT = data.ServiceEndpoint;
    SERVICE_DISCOVERY_TABLE_NAME = serviceDiscoveryTableName;
    SERVICE_DISCOVERY_KEY_NAME = serviceDiscoveryKeyName;

    checkServiceDiscoveryTableIsActive(processActiveTableCheckResult);
  }
}

function processActiveTableCheckResult(result)
{
  console.log("Waiting for table to become ACTIVE: Current State - " + result);

  if(result === 'TABLE_NOT_EXIST')
  {
    createServiceDiscoveryTable(function(result) {
      console.log('Table creation result: ' + result);
    });

    setTimeout(function() { checkServiceDiscoveryTableIsActive(processActiveTableCheckResult) }, 2500);
  }
  else if(result === 'CREATING')
  {
    setTimeout(function() { checkServiceDiscoveryTableIsActive(processActiveTableCheckResult) }, 2500);
  }
  else if(result === 'ACTIVE')
  {
    storeServiceSelfRegistration(SERVICE_DISCOVERY_KEY_NAME, SLS_ENDPOINT, function(){});
  }
}

function storeServiceSelfRegistration(key, value, callback ) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
      TableName: SERVICE_DISCOVERY_TABLE_NAME,
      Item: {
          "serviceDiscoveryKey":  key,
          "serviceDiscoveryvalue": value
      }
  };

  docClient.put(params, function(err, data) {
     if (err) {
         console.error("Unable to add serviceDiscoveryKey", key, ". Error JSON:", JSON.stringify(err, null, 2));
         callback(false, "Unable to add serviceDiscoveryKey");
     } else {
         console.log("Service Self Registration succeeded:", key);
         callback(true, "Service Self Registration succeeded");
     }
  });
}


function createServiceDiscoveryTable(callback) {
  console.log("Creating Service Discovery Table");
  var dynamodb = new AWS.DynamoDB();

  var params = {
      TableName : SERVICE_DISCOVERY_TABLE_NAME,
      KeySchema: [
          { AttributeName: "serviceDiscoveryKey", KeyType: "HASH"},  //Partition key
      ],
      AttributeDefinitions: [
          { AttributeName: "serviceDiscoveryKey", AttributeType: "S" }
      ],
      ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
      }
  };

  dynamodb.createTable(params, function(err, data) {
      if (err) {
          callback(false);
      } else {
          callback(true);
      }
    }
  );

}

function checkServiceDiscoveryTableIsActive(callback) {
  //Check for the existence of the Service Discovery Table in the AWS Environment
  var dynamoDBObject = new AWS.DynamoDB({apiVersion: '2012-10-08'});
  var params =
  {
    TableName: SERVICE_DISCOVERY_TABLE_NAME
  };

  // Call DynamoDB to retrieve the selected table descriptions
  dynamoDBObject.describeTable(params, function(err, data) {
    if (err) {
      if(err.code === 'ResourceNotFoundException') {
        callback('TABLE_NOT_EXIST');
      }
      else {
        callback('UNSPECIFIED_ERROR');
      }
    } else {
      callback(data.Table.TableStatus);
    }
  });
}
