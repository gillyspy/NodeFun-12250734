// options.js
var fs = require('fs'),
configFile =     __dirname + '/.mongodb.config.json';
secretFile = __dirname + '/.session-secret.json';
var parsedDB = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
var parsedSecret = JSON.parse(fs.readFileSync(secretFile,'UTF-8'));
exports.configOptions = {
    db    : parsedDB,
    secret: parsedSecret.secret
};
