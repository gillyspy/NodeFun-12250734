// options.js
const
  fs = require('fs'),
configFile =     __dirname + '/.mongodb.config.json';
secretFile = __dirname + '/.session-secret.json';
sendgridConfig = __dirname + '/.sendgrid.json';
const parsedDB = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
const parsedSecret = JSON.parse(fs.readFileSync(secretFile,'UTF-8'));
const parsedSendGridOptions = JSON.parse(fs.readFileSync(sendgridConfig,'UTF-8'));
exports.configOptions = {
    db    : parsedDB,
    secret: parsedSecret.secret,

};

exports.sendGridOptions = parsedSendGridOptions;