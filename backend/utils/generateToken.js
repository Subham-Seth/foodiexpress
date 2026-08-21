const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_jwt_dev_secret_key', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
