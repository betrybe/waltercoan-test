const jwt = require('jsonwebtoken');
const { AuthUser } = require('../models/authUser');
const userService = require('../services/userService');
const config = require('../config');

exports.login = async function (req, res) {
    const authUser = new AuthUser();
    try {
        authUser.fill(req.body);
        await userService.validateUser(authUser).then((response) => {
            const id = response._id;
            const token = jwt.sign({ id }, config.secret, {
                expiresIn: 300 
            });
            res.status(200).json({ token: token });
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(401).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};