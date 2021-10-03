const jwt = require('jsonwebtoken');
const userService = require('./userService');
const config = require('../config');

function performAuth(req) {
    if ((req.url.includes( '/recipes' ) && req.method === 'POST') ||
        (req.url.includes( '/recipes' ) && req.method === 'PUT')  ||
        (req.url.includes( '/recipes' ) && req.method === 'DELETE')) {
        return true;
    }
    return false;
}

exports.checkToken = async function verifyJWT(req, res, next) {
    if (performAuth(req)) {
        const token = req.headers.authorization;
        if (!token) res.status(401).json({ message: 'missing auth token' });
        
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) return res.status(401).json({ message: 'jwt malformed' });
            userService.getById(decoded.id).then((response) => {
                if (response !== null) {
                    req.userId = decoded.id;
                    next();
                }
            }).catch(() => res.status(401).json({ message: 'jwt malformed' }));
        });
    } else {
        next();
    }
};
exports.isAdminUser = async function (id) {
    return new Promise((resolve, reject) => {
        userService.getById(id).then((response) => {
            if (response != null) {
                if(response.role === 'admin'){
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};