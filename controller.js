const schema = require('./Models');

class UserController {
    static userLogin = async (req, res) => {
        try {
            res.send("Login");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static userCreate = async (req, res) => {
        try {
            res.send("Create");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static userUpdate = async (req, res) => {
        try {
            console.log(req.bodyS);
            res.send("update");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static userDelete = async (req, res) => {
        try {
            res.send("delete");
        } catch (e) {
            res.send({ err: e })
        }
    }
}

class PostController {
    static createPost = async (req, res) => {
        try {
            res.send("Create Posts");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static viewPost = async (req, res) => {
        try {
            res.send("View Posts");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static updatePost = async (req, res) => {
        try {
            console.log(req.body);
            res.send("update Posts");
        } catch (e) {
            res.send({ err: e })
        }
    }

    static deletePost = async (req, res) => {
        try {
            res.send("delete Posts");
        } catch (e) {
            res.send({ err: e })
        }
    }
}
const controller = { user: UserController, post: PostController };
module.exports = controller;