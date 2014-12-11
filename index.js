var apn = require('apn');

exports.handler = function(event, context) {
  console.log("Running aws ios push message function");
  console.log("==================================");
  // console.log("event", event);

  var messageCounter = 0;
  var options = {
    production: (event.stage == 'production')
  };
  
  if (event.cert != null && event.key != null) {
    // You can send cert and key with the event data if you're using this lambda function for 
    // multiple apps...
    options.cert = new Buffer(event.cert, "base64");
    options.key = new Buffer(event.key, "base64");
  } else {
    // ...or provide the cert and key as files within the lambda function package (more secure).
    options.cert = (event.stage == 'production' ? "prod_cert.pem" : "dev_cert.pem");
    options.key = (event.stage == 'production' ? "prod_key.pem" : "dev_key.pem");
  }
  
  var service = new apn.connection(options);

  service.on('connected', function() {
    console.log("Connected");
  });

  service.on('transmissionError', function(errCode, notification, device) {
    console.log("Notification caused error: " + errCode + " for device ", device, notification);
    messageCounter++;
    if (messageCounter == event.tokens.length) {
      setTimeout(function () {
        context.done();
      }, 1000);
    }
  });

  service.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
    messageCounter++;
    
    if (messageCounter == event.tokens.length) {
      setTimeout(function () {
        context.done();
      }, 1000);
    }
  });

  service.on('timeout', function () {
    console.log("Connection Timeout");
    context.done();
  });

  service.on('disconnected', function() {
    console.log("Disconnected from APNS");
    context.done();
  });

  service.on('socketError', function() {
    console.log("Socket error");
    context.done();
  });

  var note = new apn.Notification();
  if (event.badge_number != null) {
    note.badge = event.badge_number;
  }
  if (event.expiry != null) {
    note.expiry = event.expiry;  
  }
  if (event.content_available != null) {
    note.contentAvailable = event.content_available;
  } else if (event.newsstand_available != null) {
    note.newsstandAvailable = event.newsstand_available;
  } else {
    note.sound = (event.sound != null ? event.sound : "default");
    
    if (event.alert_message != null) {
      note.alert = event.alert_message;
    }
  }
  if (event.category != null) {
    note.category = event.category;
  }
  if (event.custom_data != null) {
    note.payload = event.custom_data;
  }
  service.pushNotification(note, event.tokens);
}
