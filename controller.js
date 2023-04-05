require('dotenv').config();;
const schema = require('./Models');
const hash = require('bcrypt');
const Jwt = require('jsonwebtoken');
const jwtKey = process.env.JWTKEY;
const connectRedis = require('./redisConn');
const client = connectRedis();

class UserController {

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await schema.User.findOne({ email });
            if (result != null) {
                const isMatch = await hash.compare(password, result.password);
                if (isMatch) {
                    const token = Jwt.sign({ result }, jwtKey, { expiresIn: "2h" });
                    const refreshToken = Jwt.sign({ result }, process.env.JWTKEYREFRESH, { expiresIn: '1d' });
                    await client.client.set(result._id.toString(), refreshToken, "EX", 86400000);
                    res.status(200).send(token ? { 'Login': true, 'user data': { id: result._id, name: result.name, email: result.email }, token, refreshToken } : { 'Login': false });
                } else {
                    res.status(401).send({ Login: false, Reason: 'Invalid Credentials' });
                }
            } else {
                res.status(401).send({ Login: false, Reason: 'User Not Found' });
            }
        } catch (err) {
            res.status(500).send(err)
        }
    }

    static userCreate = async (req, res) => {
        try {
            const { name, email, mobile, password } = req.body;
            const result = await new schema.User({ name: name, email: email, mobile: mobile, password: await hash.hash(password, 10), }).save();
            res.status(200).send(result ? { 'Created': true, 'data': result } : { 'Created': false });
        } catch (e) {
            res.status(500).send(e)
        }
    }

    static userUpdate = async (req, res) => {
        try {
            const data = req.body;
            if (req.body.password) { req.body.password = await hash.hash(req.body.password, 10) }
            const result = await schema.User.findByIdAndUpdate(req.user._id, { $set: data }, { new: true });
            res.status(200).send(result ? { 'Updated': true, 'Updated data': result } : { 'Updated': false });
        } catch (e) {
            res.status(500).send(e)
        }
    }

    static userDelete = async (req, res) => {
        try {
            const result = await schema.User.findByIdAndDelete(req.user._id);
            res.status(200).send(result ? { 'Deleted': true, 'Deleted data': result } : { 'Deleted': false });
        } catch (e) {
            res.status(500).send(e);
        }
    }
}

class PostController {
    static createPost = async (req, res) => {
        try {
            const { message } = req.body;
            const createdBy = req.user._id;
            const result = await new schema.Post({ createdBy, message }).save();
            res.status(200).send(result ? { 'Created': true, 'Created Post': result } : { 'Created': false });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    static viewPost = async (req, res) => {
        try {
            const result = await schema.Post.find().populate({ path: 'createdBy', select: 'name email mobile' });
            res.status(200).send(result && result.length > 0 ? { 'Avaiable': true, 'Length': result.length, 'Posts': result } : { 'Avaiable': false });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    static updatePost = async (req, res) => {
        try {
            let result;
            console.log(req.params.id, req.user._id)
            // if message and comments both want to update
            if (req.body.message && req.body.comments) { result = await schema.Post.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, { $set: { message: req.body.message }, $push: { comments: { sentBy: req.user._id, liked: req.user._id } } }, { new: true }); }
            else {
                //if only message want to update
                if (req.body.message) { result = await schema.Post.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, { $set: req.body }, { new: true }); }
                //if only comments want to update
                if (req.body.comments) { result = await schema.Post.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, { $push: { comments: { sentBy: req.user._id, liked: req.user._id } } }, { new: true }); }
            }
            res.status(200).send(result ? { 'Update Post': true, 'Updated data': result } : { 'Update Post': false });
        } catch (e) {
            res.status(500).send(e);
        }
    }

    static deletePost = async (req, res) => {
        try {
            const result = await schema.Post.deleteOne({ _id: req.params.id, createdBy: req.user._id });
            res.status(200).send(result ? { 'Delete Post': true, 'Deleted Post': result } : { 'Deleted': false });
        } catch (e) {
            res.status(500).send(e);
        }
    }
}
const controller = { user: UserController, post: PostController };
module.exports = controller;
