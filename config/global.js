'use strict';

const developmentConfig = require('../environment/dev.json');

const environment = process.env.NODE_ENV || 'development';
let mongoHost, mongoUserName, mongoPassword, mongoDbName, serverBaseUrl

if (environment === 'production') {
    mongoHost = process.env.MONGO_HOST;
    mongoUserName = process.env.MONGO_USERNAME;
    mongoPassword = process.env.MONGO_PASSWORD;
    mongoDbName = process.env.MONGO_DB_NAME;
    serverBaseUrl = process.env.SERVER_BASE_URl;
} else {
    mongoHost = developmentConfig.MONGO_HOST;
    mongoUserName = developmentConfig.MONGO_USERNAME;
    mongoPassword = developmentConfig.MONGO_PASSWORD;
    mongoDbName = developmentConfig.MONGO_DB_NAME;
    serverBaseUrl = developmentConfig.SERVER_BASE_URl
}

global.environment = environment;
global.mongoHost = mongoHost;
global.mongoUserName = mongoUserName;
global.mongoPassword = mongoPassword;
global.mongoDbName = mongoDbName;
global.serverBaseUrl = serverBaseUrl
