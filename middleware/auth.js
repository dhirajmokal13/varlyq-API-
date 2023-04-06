require('dotenv').config();
const Jwt = require('jsonwebtoken');
const { redisClient, blackList} = require('../redisConn');

const userAuth = async (req, res, next) => {
    try {
        console.log("blacklisted "+blackList)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);
        if (blackList.includes(token)) res.status(403).send('Token Expired');
        Jwt.verify(token, process.env.JWTKEY, (err, user) => {
            if (err) return err.name === 'JsonWebTokenError' ? res.sendStatus(401) : res.status(401).send(err.message)
            req.user = user.result;
            next();
        });
    } catch (e) {
        res.sendStatus(500);
    }
}

const refreshTokenAuth = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);
        Jwt.verify(token, process.env.JWTKEYREFRESH, async (err, user) => {
            const result = user.result;
            if (err) return res.sendStatus(403);
            const results = await redisClient.get(result._id.toString());
            console.log(results, token)
            if (token === results) {
                const tokenr = Jwt.sign({ result }, process.env.JWTKEY, { expiresIn: "2h" });
                const refreshToken = Jwt.sign({ result }, process.env.JWTKEYREFRESH, { expiresIn: '1d' });
                await redisClient.set(result._id.toString(), refreshToken, "EX", 86400000);
                res.status(200).send({ token: tokenr, refreshToken });
                return;
            } else {
                return res.sendStatus(401)
            }
        })
    } catch (err) {
        res.sendStatus(500);
    }
}

const Logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(401);
        Jwt.verify(token, process.env.JWTKEY, async (err, user) => {
            if (err) return res.sendStatus(403);
            console.log(blackList.push(token));
            const result = user.result;
            await redisClient.del(result._id.toString());
            res.sendStatus(204);
        });
    } catch (err) {
        res.sendStatus(500);
    }
};

module.exports = { userAuth, refreshTokenAuth, Logout };