'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const questionSchema = require('./questionModel');
const MediaSchema = require('./mediaModel');
const UserSchema = require('./userModel');
const quizConfig = require('./config.json');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: 50,
        trim: true,
        index: true,
        required: [true, 'Quiz title is required']
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500,
    },
    duration: {
        type: Number,
        required: [true, 'Quiz duration is required']
    },
    mediaInfo: {
        type: MediaSchema
    },
    hasUserRegistered: {
        type: Boolean,
        default: false
    },
    hasUserParticipated: {
        type: Boolean,
        default: false
    },
    participantCount: {
        type: Number,
        default: 0
    },
    registrationCount: {
        type: Number,
        default: 0
    },
    questionCount: {
        type: Number,
        required: [true, 'Question count is required']
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    questions: {
        type: [questionSchema],
        validate: {
            validator: function (props) {
                return props && props.length > 0
            },
            message: 'Questions cannot be empty array'
        },
        required: [true, 'Questions are required']
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks is required']
    },
    status: {
        type: String,
        default: quizConfig.quizStatus.submitted,
        enum: quizConfig.quizStatus.values
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdBy: {
        type: UserSchema,
        required: [true, 'CreatedBy is required']
    },
    updatedBy: {
        type: UserSchema
    }
},{
    timestamps: true
})

quizSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Quiz', quizSchema, 'quizzes');
