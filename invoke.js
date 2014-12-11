// Code example to invoke a lambda function from code...
var aws = require('aws-sdk');
aws.config.loadFromPath('client-config.json');
var lambda = new aws.Lambda({apiVersion: '2014-11-11'});
var params = {
  FunctionName: 'aws-lambda-ios-push-message-production',
  InvokeArgs: '{"platform": "ios", "stage": "production", "tokens": ["TODO"], "alert_message": "You have a message!"}'
};
lambda.invokeAsync(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
