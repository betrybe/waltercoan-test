const userService = require('../services/userService');
const { User } = require('../models/user');

exports.getAll = function (req, res) {
    userService.getAll().then((response) => {
        res.status(200);
        res.send(response);
    });
};
exports.insertNew = async function (req, res) {
    let newUser = new User();
    try {
        newUser.fill(req.body);
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
        if (!validEmail.test(newUser.email)) {
            res.status(400).send({ message: "Invalid entries. Try again." });
        } else {
            await userService.insertNew(newUser, req.userId).then((response) => {
                newUser = response.result;
                delete newUser.password;
                res.status(201);
                res.send({ user: newUser }).end();    
            }).catch((error) => {
                res.statusMessage = error.toString();
                res.status(409).send({ message: error.message });
            });
        }
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};

exports.insertNewAdmin = async function (req, res) {
    let newUser = new User();
    try {
        newUser.fill(req.body);
        newUser.role = 'admin';
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
        if (!validEmail.test(newUser.email)) {
            res.status(400).send({ message: "Invalid entries. Try again." });
        } else {
            await userService.insertNew(newUser, req.userId).then((response) => {
                newUser = response.result;
                delete newUser.password;
                res.status(201);
                res.send({ user: newUser }).end();    
            }).catch((error) => {
                res.statusMessage = error.toString();
                res.status(403).send({ message: error.message });
            });
        }
    } catch (e) {
        res.statusMessage = e.toString();
        res.status(400).send({ message: e.message });
    }
};
