'use strict'

const mongoose = require('mongoose');
const UserSchema = require('./userModel');

const quizUserResponsesSchema = new mongoose.Schema({
    _id: false,
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userSelectedOptionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        default: null,
    },
    isSkipped: {
        type: Boolean,
        default: true
    },
    isUserSelectedCorrectOptions: {
        type: Boolean,
        default: false,
    },
    marks: {
        type: Number,
        default: 0
    }
})

const quizParticipationSchema = new mongoose.Schema({
    mcqId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true
    },
    userResponses: {
        type: [quizUserResponsesSchema],
        required: true
    },
    userQuestionAttemptedCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: UserSchema,
        required: true
    },
    userMarks: {
        type: Number,
        required: true
    },
    negativeMarks: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model('QuizParticipation', quizParticipationSchema, 'quizParticipation');
