// options.js
var fs = require('fs'),
configPath =     __dirname + '/.mongodb.config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig =  parsed;