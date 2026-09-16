const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'public') => {
    const secret = process.env.JWT_SECRET || 'tvarita_arts_collective_jwt_secret_dev_2026';
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

module.exports = generateToken;
