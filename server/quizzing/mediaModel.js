'use strict'
const mongoose = require("mongoose");
const config = require("./config.json");

const mediaSchema = new mongoose.Schema({
    _id: false,
    mediaUrl: {
        type: String,
        required: true
    },

    mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    mediaType: {
        type: String,
        default: config.mediaTypes.image,
        enum: config.mediaTypes.values
    }
});

module.exports = mediaSchema
