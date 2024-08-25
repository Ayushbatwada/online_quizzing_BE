'use strict';

let mongodbUrl;
if (environment === 'production') {
    mongodbUrl = `mongodb+srv://${mongoUserName}:${mongoPassword}@${mongoHost}/${mongoDbName}?retryWrites=true&w=majority`;
} else {
    mongodbUrl = `mongodb://${mongoHost}/${mongoDbName}`;
}

module.exports = {
    mongodbUrl: mongodbUrl
}
