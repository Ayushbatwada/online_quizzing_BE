'use strict';

const express = require('express');
const quizController = require('./controller');

const router = express.Router();

router.post('/create', quizController.createQuiz);
router.put('/publish', quizController.publishQuiz);
router.put('/question/add', quizController.addQuestion);
router.get('/all/get', quizController.getAllQuizzes);
router.get('/detail/get', quizController.getQuizDetail);
router.post('/register', quizController.quizRegistration);
router.post('/participate', quizController.quizParticipate);

module.exports = router;
