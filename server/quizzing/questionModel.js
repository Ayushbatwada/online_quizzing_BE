'use strict'

const mongoose = require('mongoose');
const MediaSchema = require('./mediaModel');
const quizConfig = require('./config.json');

const OptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: {
            values: [true],
            message: 'Option title is required, received {VALUE}'
        }
    },
    description: {
        type: String
    },
    mediaType: {
        type: String,
        enum: quizConfig.mediaTypes.values,
        default: quizConfig.mediaTypes.text
    },
    isCorrectOption: {
        type: Boolean,
        required: true,
        select: false,
        default: false
    },
    mediaInfo: {
        type: MediaSchema,
        required: function() {
            return this.mediaType !== quizConfig.mediaTypes.text
        }
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.optionId = ret._id;
            delete ret._id;
        }
    }
})

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: {
            values: [true],
            message: 'Question title is required, received {VALUE}'
        }
    },
    description: {
        type: String
    },
    mediaType: {
        type: String,
        enum: quizConfig.mediaTypes.values,
        default: quizConfig.mediaTypes.text
    },
    mediaInfo: {
        type: MediaSchema,
        required: function() {
            return this.mediaType !== quizConfig.mediaTypes.text
        }
    },
    marks: {
        type: Number,
        required: [true, 'Question marks is required'],
    },
    questionType: {
        type: String,
        enum: quizConfig.questionTypes.values,
        default: quizConfig.questionTypes.mcq
    },
    hasMultiCorrectOptions: {
        type: Boolean,
        default: false
    },
    hasNegativeMarking: {
        type: Boolean,
        default: false
    },
    negativeMarkingPercent: {
        type: Number,
        required: [function() {
            return this.hasNegativeMarking
        }, 'Negative marking percent is required']
    },
    answerExplanation: {
        type: String
    },
    options: {
        type: [OptionSchema],
        required: function() {
            return this.questionType === quizConfig.questionTypes.mcq
        },
        validate: {
            validator: function (props) {
                return props && props.length > 0
            },
            message: 'Options cannot be empty array'
        },
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.questionId = ret._id;
            delete ret._id;
        }
    }
});

module.exports = questionSchema
