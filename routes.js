const healthCheck = require('./server/utils/healthCheck');
const quizRouter = require('./server/quizzing/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('/v1/api/quiz', quizRouter);
}
