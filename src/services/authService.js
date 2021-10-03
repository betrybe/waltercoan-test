const jwt = require('jsonwebtoken');
const userService = require('./userService');
const config = require('../config');

// eslint-disable-next-line complexity
function performAuth(req) {
    if ((req.url.includes('/recipes') && (req.method === 'POST' 
        || req.method === 'PUT' || req.method === 'DELETE'))
        || (req.url.includes('/users/admin') && req.method === 'POST')) {
        return true;
    }
    return false;
}
function jwtverify(req, res, next, token) {
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'jwt malformed' });
        } else {
            userService.getById(decoded.id).then((response) => {
                if (response !== null) {
                    req.userId = decoded.id;
                    next();
                }
            }).catch(() => res.status(401).json({ message: 'jwt malformed' }));
        }
    });
}
exports.checkToken = async function verifyJWT(req, res, next) {
    if (performAuth(req)) {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: 'missing auth token' });
            next();
        } else {
            jwtverify(req, res, next, token);
        }
    } else {
        next();
    }
};
exports.isAdminUser = async function isAdminUser(id) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    return new Promise((resolve, _reject) => {
        userService.getById(id).then((response) => {
            if (response != null) {
                if (response.role === 'admin') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};