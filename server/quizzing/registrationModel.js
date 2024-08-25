'use strict'

const mongoose = require('mongoose');
const UserSchema = require('./userModel');

const mcqRegistrationSchema = new mongoose.Schema({
    mcqId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        index: true,
        required: true
    },
    createdBy: {
        type: UserSchema,
        required: true
    }
},{
    timestamps: true
})

mcqRegistrationSchema.index({mcqId: 1});
module.exports = mongoose.model('McqRegistration', mcqRegistrationSchema, 'mcqRegistrations');
