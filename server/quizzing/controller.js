'use strict'

const quizService = require('./service');
const responseData = require('../utils/responseData');

module.exports = {
    createQuiz: (req, res) => {
        let response;
        try {
            quizService.createQuiz(req.body, (err, createQuizResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createQuiz" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createQuizResponse.code).send(createQuizResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "createQuiz" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    publishQuiz: (req, res) => {
        let response;
        try {
            quizService.publishQuiz(req.body, (err, publishQuizResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "publishQuiz" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(publishQuizResponse.code).send(publishQuizResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "publishQuiz" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    addQuestion: (req, res) => {
        let response;
        try {
            quizService.addQuestion(req.body, (err, addQuestionResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "addQuestion" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(addQuestionResponse.code).send(addQuestionResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "addQuestion" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getAllQuizzes: (req, res) => {
        let response;
        try {
            quizService.getAllQuizzes(req.query, (err, getAllQuizzesResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllQuizzes" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getAllQuizzesResponse.code).send(getAllQuizzesResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getAllQuizzes" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getQuizDetail: (req, res) => {
        let response;
        try {
            quizService.getQuizDetail(req.query, (err, getQuizDetailResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getQuizDetail" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getQuizDetailResponse.code).send(getQuizDetailResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getQuizDetail" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    quizRegister: (req, res) => {
        let response;
        try {
            quizService.quizRegister(req.body, (err, quizRegistrationResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "quizRegister" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(quizRegistrationResponse.code).send(quizRegistrationResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "quizRegister" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    quizParticipate: (req, res) => {
        let response;
        try {
            quizService.quizParticipate(req.body, (err, quizParticipateResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "quizParticipate" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(quizParticipateResponse.code).send(quizParticipateResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "quizParticipate" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
