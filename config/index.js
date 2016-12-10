var configFilePath = './config.'+process.env.NODE_ENV+'.js';
var config = require(configFilePath);

module.exports = config;