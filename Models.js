const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const commentSchema = new mongoose.Schema(
    {
        sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sentAt: { type: Date, default: Date.now },
        liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { _id: false }
);

const postSchema = new mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
        message: { type: String, required: true },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const Schema = { Post: mongoose.model('Post', postSchema), User: mongoose.model('User', userSchema)};
module.exports = Schema;