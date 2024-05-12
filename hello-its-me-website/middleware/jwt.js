const User = require('../models/user')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
            if(err) return res.status(401).send(null)

            const user = await User.findOne({ _id: decode.id })
            if(!user) return res.status(401).send(null)

            next();
        });
    } else {
        return res.status(401).send(null)
    }
};

module.exports = verifyToken;