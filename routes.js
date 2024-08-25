const healthCheck = require('./server/utils/healthCheck');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);
}
