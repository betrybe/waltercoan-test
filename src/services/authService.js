const jwt = require('jsonwebtoken');
const userService = require('./userService');
const config = require('../config');

exports.checkToken = async function verifyJWT(req, res, next) {
    if (req.url === '/recipes' && req.method === 'POST') {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: 'jwt malformed' });
        
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