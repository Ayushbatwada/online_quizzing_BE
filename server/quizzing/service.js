'use strict'

const quizModel = require('./quizModel');
const quizConfig = require('./config.json');
const sanityChecks = require('../utils/sanityChecks');
const responseData = require('../utils/responseData');
const registrationModel = require('server/quizzing/registrationModel');
const participationModel = require('server/quizzing/participationModel');

module.exports = {
    createQuiz: (body, callback) => {
        if (!sanityChecks.isValidString(body.title) || !sanityChecks.isNumber(body.duration) ||
            !sanityChecks.isValidArray(body.questions) || !sanityChecks.isValidDate(body.startDate)) {
            console.log('ERROR ::: Missing info "createQuiz" with info: '+ JSON.stringify(body));
            const response = new responseData.payloadError();
            return callback(null, response);
        }
        for(const question of body.questions) {
            if (!sanityChecks.isValidString(question.title) || !sanityChecks.isNumber(body.marks) || !sanityChecks.isValidArray(question.options) ||
                (sanityChecks.isBoolean(question.hasNegativeMarking) && question.hasNegativeMarking && !sanityChecks.isNumber(question.negativeMarkingPercent))) {
                console.log('ERROR ::: Missing info "createQuiz" with info: '+ JSON.stringify(body));
                const response = new responseData.payloadError();
                return callback(null, response);
            }

            let numberOfCorrectOptions = 0
            for(const option of question.options) {
                if (!sanityChecks.isValidString(option.title) || !sanityChecks.isBoolean(body.isCorrectOption) || body.options.length < 4) {
                    console.log('ERROR ::: Missing info "createQuiz" with info: '+ JSON.stringify(body));
                    const response = new responseData.payloadError();
                    return callback(null, response);
                } else if (body.isCorrectOption) {
                    numberOfCorrectOptions += 1;
                }
            }
            question.isMultiCorrectOptions = numberOfCorrectOptions > 1;
        }

        try {
            const mcq = new quizModel();
            mcq.title = body.title;
            mcq.description = body.description;
            mcq.duration= body.duration;
            mcq.mediaInfo = body.mediaInfo;
            mcq.questions = body.questions;
            mcq.startDate = body.startDate;
            mcq.userInfo = body.createdBy.userId;
            mcq.createdBy = body.createdBy;
            mcq.updatedBy = body.createdBy;
            mcq.negativeMarkingPercent = body.negativeMarkingPercent;
            mcq.hasNegativeMarking = !!body.negativeMarkingPercent;
            mcq.status = quizConfig.quizStatus.submitted;

            mcq.endDate = new Date(Date.parse(body.startDate) + body.duration * 1000).toISOString();
            mcq.questionCount = 0;
            mcq.totalMarks = 0;
            body.questions.forEach((question) => {
                mcq.questionCount += 1;
                mcq.totalMarks += question.marks
            });

            mcq.save((err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "createQuiz" service db error block with err: ', err);
                    const response = new responseData.serverError();
                    return callback(null, response);
                } else {
                    const response = new responseData.successMessage();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "createQuiz" service catch error block with err: ', err);
            const response = new responseData.serverError();
            return callback(null, response);
        }
    },

    publishQuiz: (body, callback) => {
        const updatedBy = body.updatedBy;
        const mcqId = body.mcqId;

        if (!sanityChecks.isValidMongooseId(mcqId) || !updatedBy || !sanityChecks.isValidMongooseId(updatedBy.userId)){
            console.log('ERROR ::: Missing info "createQuiz" with info: mcqId: ' + mcqId + '. createdBy: ' + JSON.stringify(updatedBy));
            const response = new responseData.payloadError();
            return callback(null, response);
        }
        try {
            const filterQuery = {
                _id: mcqId,
                status: quizConfig.quizStatus.submitted
            };

            const updateQuery = {
                status : quizConfig.quizStatus.active
            };

            const options = { returnDocument: "before" };

            quizModel.findOneAndUpdate(filterQuery, updateQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "publishQuiz" service db error block with err: ', err);
                    const response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === quizConfig.quizStatus.submitted) {
                    const response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    const response = new responseData.notFoundError();
                    return callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in "publishQuiz" service catch error block with err: ', err);
            const response = new responseData.serverError();
            return callback(null, response);
        }
    },

    addQuestion: (body, callback) => {
        const createdBy = body.createdBy;
        const mcqId = body.mcqId;

        if (!sanityChecks.isValidMongooseId(mcqId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)||
            !sanityChecks.isValidString(body.title) || !sanityChecks.isNumber(body.marks) ||
            (sanityChecks.isBoolean(body.hasNegativeMarking) && !sanityChecks.isNumber(body.negativeMarkingPercent)) && !sanityChecks.isValidArray(body.options)){
            console.log('ERROR ::: Missing info "createQuiz" with info: '+ JSON.stringify(body));
            const response = new responseData.payloadError();
            return callback(null, response);
        }

        let numberOfCorrectOptions = 0
        for(const option of body.options) {
            if (!sanityChecks.isValidString(option.title) || !sanityChecks.isBoolean(body.isCorrectOption) || body.options.length < 4) {
                console.log('ERROR ::: Missing info "addQuestion" with info: '+ JSON.stringify(body));
                const response = new responseData.payloadError();
                return callback(null, response);
            } else if (body.isCorrectOption) {
                numberOfCorrectOptions += 1;
            }
        }
        body.isMultiCorrectOptions = numberOfCorrectOptions > 1;

        try {
            const filterQuery = {
                _id: mcqId,
                "createdBy.userId": createdBy.userId,
                status: quizConfig.quizStatus.submitted
            };

            const updateQuery = {
                $push: {questions: body}, $inc: { totalMarks: body.marks, questionCount: 1 }
            };

            quizModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "addQuestion" service db error block with err: ', err);
                    const response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp) && dbResp.status === quizConfig.quizStatus.submitted) {
                    const response = new responseData.successMessage();
                    return callback(null, response);
                } else {
                    const response = new responseData.notFoundError();
                    return callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in "addQuestion" service catch error block with err: ', err);
            const response = new responseData.serverError();
            return callback(null, response);
        }
    },

    getAllQuizzes: (body, callback) => {
        let response;
        const page = body.page || 1;
        const limit = body.limit || 10;

        try {
            const options = {
                page: page,
                limit: limit,
                customLabels: responseData.customLabels
            };
            const filterQuery = {
                status: quizConfig.status.active
            };
            quizModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllQuizzes" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "getAllQuizzes" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getQuizDetail: (body, callback) => {
        let response;
        const quizId = body.qid

        if (!sanityChecks.isValidMongooseId(quizId)) {
            console.log('ERROR ::: Missing info in "getQuizDetail service with info, quizId: ' + quizId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                status: quizConfig.status.active,
                _id: quizId
            };
            quizModel.findOne(filterQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getQuizDetail" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp)) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "getQuizDetail" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    quizRegister: (body, callback) => {
        const createdBy = body.createdBy;
        const mcqId = body.mcqId;

        if (!sanityChecks.isValidMongooseId(mcqId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)){
            console.log('ERROR ::: Missing info "quizRegister" with info: mcqId: ' + mcqId + '. createdBy: ' + JSON.stringify(createdBy));
            const response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const registration = new registrationModel();
            registration.mcqId = mcqId;
            registration.createdBy = createdBy;

            registration.save((err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "quizRegister" service db error block with err: ', err);
                    const response = new responseData.serverError();
                    return callback(null, response);
                } else {
                    const response = new responseData.successMessage();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "quizRegister" service catch error block with err: ', err);
            const response = new responseData.serverError();
            return callback(null, response);
        }
    },

    quizParticipate: (body, callback) => {
        const createdBy = body.createdBy;
        const mcqId = body.mcqId;
        const userResponses = body.userResponses;
        const userMarks = body.userMarks;
        const userQuestionAttemptedCount = body.userQuestionAttemptedCount;
        const negativeMarks = body.negativeMarks;

        if (!sanityChecks.isValidMongooseId(mcqId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !sanityChecks.isNumber(userMarks) || !sanityChecks.isNumber(userQuestionAttemptedCount) || !sanityChecks.isValidArray(userResponses)){
            console.log('ERROR ::: Missing info "quizParticipate" with info: body: ' + JSON.stringify(body));
            const response = new responseData.payloadError();
            return callback(null, response);
        }

        for (const userResponse of userResponses) {
            if (!sanityChecks.isValidMongooseId(userResponse.questionId)) {
                console.log('ERROR ::: Missing info "quizParticipate" with info: questionId: ' + userResponses.questionId);
                const response = new responseData.payloadError();
                return callback(null, response);
            }
        }

        try {
            const participation = new participationModel();
            participation.mcqId = mcqId;
            participation.createdBy = createdBy;
            participation.userResponses = userResponses;
            participation.userMarks = userMarks;
            participation.userQuestionAttemptedCount = userQuestionAttemptedCount;
            participation.negativeMarks = negativeMarks;

            participation.save((err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "quizParticipate" service db error block with err: ', err);
                    const response = new responseData.serverError();
                    return callback(null, response);
                } else {
                    const response = new responseData.successMessage();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "quizParticipate" service catch error block with err: ', err);
            const response = new responseData.serverError();
            return callback(null, response);
        }
    },

}
