/* eslint-disable sonarjs/no-identical-functions */
const userService = require('../services/userService');
const { User } = require('../models/user');

async function insertNewUserService(res, newUser, userIdreq) {
    await userService.insertNew(newUser, userIdreq).then((response) => {
        const returnUser = response.result;
        delete returnUser.password;
        res.status(201).send({ user: newUser }).end();    
    }).catch((error) => {
        res.status(409).send({ message: error.message });
    });
}
async function insertNewAdminUserService(res, newUser, userIdreq) {
    await userService.insertNew(newUser, userIdreq).then((response) => {
        const returnUser = response.result;
        delete returnUser.password;
        res.status(201).send({ user: newUser }).end();    
    }).catch((error) => {
        res.status(403).send({ message: error.message });
    });
}
exports.getAll = function getAll(req, res) {
    userService.getAll().then((response) => {
        res.status(200);
        res.send(response);
    });
};
exports.insertNew = async function insertNew(req, res) {
    const newUser = new User();
    try {
        newUser.fill(req.body);
        const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/g;
        if (!validEmail.test(newUser.email)) {
            res.status(400).send({ message: 'Invalid entries. Try again.' });
        } else {
            insertNewUserService(res, newUser, req.userId); 
        }
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
};

exports.insertNewAdmin = async function insertNewAdmin(req, res) {
    const newUser = new User();
    try {
        newUser.fill(req.body);
        newUser.role = 'admin';
        const validEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/g;
        if (!validEmail.test(newUser.email)) {
            res.status(400).send({ message: 'Invalid entries. Try again.' });
        } else {
            insertNewAdminUserService(res, newUser, req.userId);
        }
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
};
