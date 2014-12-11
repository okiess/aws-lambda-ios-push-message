// Code example to invoke a lambda function from code...
var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('client-config.json');
var lambda = new aws.Lambda({apiVersion: '2014-11-11'});

var event = {
  platform: "ios",
  stage: "production",
  tokens: ["TODO"],
  alert_message: "You have a message!",
  sound: "default",
  badge_number: 0,
  custom_data: {
    foo: "bar"
  }
}

if (event.stage == 'development') {
  event.cert = new Buffer(fs.readFileSync("dev_cert.pem", "utf-8")).toString('base64');
  event.key = new Buffer(fs.readFileSync("dev_key.pem", "utf-8")).toString('base64');
} else {
  event.cert = new Buffer(fs.readFileSync("prod_cert.pem", "utf-8")).toString('base64');
  event.key = new Buffer(fs.readFileSync("prod_key.pem", "utf-8")).toString('base64');
}

var params = {
  FunctionName: 'aws-lambda-ios-push-message-production',
  InvokeArgs: JSON.stringify(event)
};
lambda.invokeAsync(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
