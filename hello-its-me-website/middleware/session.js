const User = require('../models/user')
const jwt = require('jsonwebtoken')

const verifySession = (req, res, next) => {
    if (req.cookies.token) {
        jwt.verify(req.cookies.token, process.env.SECRET, { algorithms: ["HS256"] }, async (err, decode) => {
            if(err) return res.redirect("/")

            const user = await User.findOne({ _id: decode.id })
            if(!user) return res.redirect("/")

            next();
        });
    } else {
        return res.redirect("/")
    }
};

module.exports = verifySession;