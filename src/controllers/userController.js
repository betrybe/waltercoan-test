const userService = require('../services/userService');
const { User } = require('../models/user');

exports.getAll = function (req, res) {
    userService.getAll().then((response) => {
        res.status(200);
        res.send(response);
    });
};
exports.insertNew = async function (req, res) {
    const newUser = new User();
    try {
        newUser.fill(req.body);
        
        await userService.insertNew(newUser).then((response) => {
            res.status(201);
            res.send({ user: response.result }).end();    
        }).catch((error) => {
            res.statusMessage = error.toString();
            res.status(409).send({ message: error.message });
        });
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};