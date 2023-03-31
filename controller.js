const dotenv = require('dotenv').config();;
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
            console.log(err)
            res.status(500).send(err)
        }
    }

    static userCreate = async (req, res) => {
        try {
            const { name, email, mobile, password } = req.body;
            const result = await new schema.User({ name: name, email: email, mobile: mobile, password: await hash.hash(password, 10), }).save();
            res.status(200).send(result ? { 'Created': true, 'data': result } : { 'Created': false });
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }

    static userUpdate = async (req, res) => {
        try {
            const data = req.body;
            if (req.body.password) { req.body.password = await hash.hash(req.body.password, 10) }
            const result = await schema.User.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
            res.status(200).send(result ? { 'Updated': true, 'Updated data': result } : { 'Updated': false });
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }

    static userDelete = async (req, res) => {
        try {
            const result = await schema.User.findByIdAndDelete(req.params.id);
            res.status(200).send(result ? { 'Deleted': true, 'Deleted data': result } : { 'Deleted': false });
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }
}

class PostController {
    static createPost = async (req, res) => {
        try {
            res.send("Create Posts" + req.user);
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }

    static viewPost = async (req, res) => {
        try {
            res.send(req.user);
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }

    static updatePost = async (req, res) => {
        try {
            console.log(req.body);
            res.send("update Posts");
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }

    static deletePost = async (req, res) => {
        try {
            res.send("delete Posts");
        } catch (e) {
            res.status(500).send({ err: e })
        }
    }
}
const controller = { user: UserController, post: PostController };
module.exports = controller;