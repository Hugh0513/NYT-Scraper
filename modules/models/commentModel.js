'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    name: String,
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
    },
    comment: String
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;